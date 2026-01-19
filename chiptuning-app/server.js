const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load chiptuning database
let chiptuningData = {};
try {
    const dataPath = path.join(__dirname, 'data', 'chiptuning-database.json');
    const extendedPath = path.join(__dirname, 'data', 'extended-database.json');
    
    if (fs.existsSync(dataPath)) {
        chiptuningData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Load extended database if exists
        if (fs.existsSync(extendedPath)) {
            const extendedData = JSON.parse(fs.readFileSync(extendedPath, 'utf8'));
            
            // Merge additional vehicles
            if (extendedData.additional_vehicles) {
                chiptuningData.chiptuning_database.vehicles.push(...extendedData.additional_vehicles);
            }
            
            // Merge Chinese brands
            if (extendedData.chinese_brands) {
                chiptuningData.chiptuning_database.vehicles.push(...extendedData.chinese_brands);
            }
            
            // Merge Indian brands
            if (extendedData.indian_brands) {
                chiptuningData.chiptuning_database.vehicles.push(...extendedData.indian_brands);
            }
            
            // Merge additional European brands
            if (extendedData.additional_european_brands) {
                chiptuningData.chiptuning_database.vehicles.push(...extendedData.additional_european_brands);
            }
            
            // Merge luxury electric brands
            if (extendedData.luxury_electric_brands) {
                chiptuningData.chiptuning_database.vehicles.push(...extendedData.luxury_electric_brands);
            }
            
            // Update metadata
            chiptuningData.chiptuning_database.metadata.total_vehicles = chiptuningData.chiptuning_database.vehicles.length;
            chiptuningData.chiptuning_database.metadata.total_brands = [...new Set(chiptuningData.chiptuning_database.vehicles.map(v => v.brand))].length;
            
            console.log(`📊 Extended database loaded: ${chiptuningData.chiptuning_database.vehicles.length} vehicles from ${chiptuningData.chiptuning_database.metadata.total_brands} brands`);
        }
    } else {
        console.log('Database file not found, using sample data');
        chiptuningData = require('./sample-data.js');
    }
} catch (error) {
    console.error('Error loading database:', error);
    chiptuningData = require('./sample-data.js');
}

// API Routes
app.get('/api/brands', (req, res) => {
    try {
        const brands = [...new Set(chiptuningData.chiptuning_database.vehicles.map(v => v.brand))].sort();
        res.json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/models/:brand', (req, res) => {
    try {
        const { brand } = req.params;
        const models = chiptuningData.chiptuning_database.vehicles
            .filter(v => v.brand.toLowerCase() === brand.toLowerCase())
            .map(v => ({
                model: v.model,
                year: v.year,
                engine: v.engine,
                fuel_type: v.fuel_type,
                id: v.id
            }))
            .sort((a, b) => a.model.localeCompare(b.model));
        
        res.json({ success: true, models });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/vehicle/:id', (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = chiptuningData.chiptuning_database.vehicles.find(v => v.id == id);
        
        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }

        // Calculate gains for each stage
        const stages = {};
        Object.keys(vehicle.tuning_stages).forEach(stage => {
            const stageData = vehicle.tuning_stages[stage];
            const original = vehicle.original_specs;
            
            stages[stage] = {
                ...stageData,
                hp_gain: stageData.hp - original.hp,
                hp_gain_percent: Math.round(((stageData.hp - original.hp) / original.hp) * 100),
                torque_gain: stageData.torque - original.torque,
                torque_gain_percent: Math.round(((stageData.torque - original.torque) / original.torque) * 100)
            };
        });

        res.json({
            success: true,
            vehicle: {
                ...vehicle,
                calculated_stages: stages
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ success: true, results: [] });
        }

        const searchTerm = q.toLowerCase();
        const results = chiptuningData.chiptuning_database.vehicles
            .filter(v => 
                v.brand.toLowerCase().includes(searchTerm) ||
                v.model.toLowerCase().includes(searchTerm) ||
                v.engine.toLowerCase().includes(searchTerm)
            )
            .slice(0, 10)
            .map(v => ({
                id: v.id,
                brand: v.brand,
                model: v.model,
                year: v.year,
                engine: v.engine,
                fuel_type: v.fuel_type,
                original_hp: v.original_specs.hp
            }));

        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/stats', (req, res) => {
    try {
        const vehicles = chiptuningData.chiptuning_database.vehicles;
        const stats = {
            total_vehicles: vehicles.length,
            total_brands: [...new Set(vehicles.map(v => v.brand))].length,
            fuel_types: [...new Set(vehicles.map(v => v.fuel_type))],
            avg_stage1_gain: Math.round(
                vehicles.reduce((sum, v) => {
                    if (v.tuning_stages.stage1) {
                        return sum + ((v.tuning_stages.stage1.hp - v.original_specs.hp) / v.original_specs.hp * 100);
                    }
                    return sum;
                }, 0) / vehicles.length
            ),
            price_ranges: {
                stage1: {
                    min: Math.min(...vehicles.map(v => v.tuning_stages.stage1?.price || 0).filter(p => p > 0)),
                    max: Math.max(...vehicles.map(v => v.tuning_stages.stage1?.price || 0)),
                    avg: Math.round(vehicles.reduce((sum, v) => sum + (v.tuning_stages.stage1?.price || 0), 0) / vehicles.length)
                },
                stage2: {
                    min: Math.min(...vehicles.map(v => v.tuning_stages.stage2?.price || 0).filter(p => p > 0)),
                    max: Math.max(...vehicles.map(v => v.tuning_stages.stage2?.price || 0)),
                    avg: Math.round(vehicles.reduce((sum, v) => sum + (v.tuning_stages.stage2?.price || 0), 0) / vehicles.length)
                },
                stage3: {
                    min: Math.min(...vehicles.map(v => v.tuning_stages.stage3?.price || 0).filter(p => p > 0)),
                    max: Math.max(...vehicles.map(v => v.tuning_stages.stage3?.price || 0)),
                    avg: Math.round(vehicles.reduce((sum, v) => sum + (v.tuning_stages.stage3?.price || 0), 0) / vehicles.length)
                }
            },
            brand_distribution: vehicles.reduce((acc, v) => {
                acc[v.brand] = (acc[v.brand] || 0) + 1;
                return acc;
            }, {}),
            difficulty_distribution: vehicles.reduce((acc, v) => {
                const difficulty = v.ecu_info?.difficulty || 'Unknown';
                acc[difficulty] = (acc[difficulty] || 0) + 1;
                return acc;
            }, {})
        };
        
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CSV Export endpoint
app.get('/api/export/csv', (req, res) => {
    try {
        const vehicles = chiptuningData.chiptuning_database.vehicles;
        let csv = 'Brand,Model,Year,Engine,Fuel Type,Original HP,Stage1 HP,Stage1 Price,Stage2 HP,Stage2 Price,Stage3 HP,Stage3 Price,Difficulty,Notes\n';
        
        vehicles.forEach(v => {
            const row = [
                v.brand,
                v.model,
                v.year,
                v.engine,
                v.fuel_type,
                v.original_specs.hp,
                v.tuning_stages.stage1?.hp || '',
                v.tuning_stages.stage1?.price || '',
                v.tuning_stages.stage2?.hp || '',
                v.tuning_stages.stage2?.price || '',
                v.tuning_stages.stage3?.hp || '',
                v.tuning_stages.stage3?.price || '',
                v.ecu_info?.difficulty || '',
                (v.notes || '').replace(/,/g, ';')
            ].join(',');
            csv += row + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="force-yazilim-database.csv"');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Price calculator endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { vehicleId, stage, modifications } = req.body;
        const vehicle = chiptuningData.chiptuning_database.vehicles.find(v => v.id == vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }
        
        const stageData = vehicle.tuning_stages[stage];
        if (!stageData) {
            return res.status(404).json({ success: false, error: 'Stage not found' });
        }
        
        let totalPrice = stageData.price;
        let additionalMods = [];
        
        // Calculate additional modification costs
        if (modifications && modifications.length > 0) {
            const modPrices = {
                'Downpipe': 3500,
                'Intercooler': 4500,
                'Cold Air Intake': 2500,
                'Exhaust System': 6000,
                'Turbo Upgrade': 15000,
                'Injectors': 8000,
                'Fuel System': 12000,
                'HPFP': 5500,
                'Clutch': 8500,
                'Transmission': 25000,
                'Supercharger': 35000,
                'Internals': 20000,
                'Cooling System': 7000,
                'Battery Management': 10000,
                'Motor Upgrade': 18000,
                'Inverter': 12000,
                'Battery Pack': 30000
            };
            
            modifications.forEach(mod => {
                if (modPrices[mod]) {
                    totalPrice += modPrices[mod];
                    additionalMods.push({ name: mod, price: modPrices[mod] });
                }
            });
        }
        
        const calculation = {
            vehicle: {
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year
            },
            stage: stage,
            base_price: stageData.price,
            modifications: additionalMods,
            total_price: totalPrice,
            performance: {
                original_hp: vehicle.original_specs.hp,
                tuned_hp: stageData.hp,
                hp_gain: stageData.hp - vehicle.original_specs.hp,
                hp_gain_percent: Math.round(((stageData.hp - vehicle.original_specs.hp) / vehicle.original_specs.hp) * 100),
                original_torque: vehicle.original_specs.torque,
                tuned_torque: stageData.torque,
                torque_gain: stageData.torque - vehicle.original_specs.torque,
                torque_gain_percent: Math.round(((stageData.torque - vehicle.original_specs.torque) / vehicle.original_specs.torque) * 100)
            },
            estimated_time: stageData.estimated_time,
            fuel_improvement: stageData.fuel_improvement
        };
        
        res.json({ success: true, calculation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        vehicles_loaded: chiptuningData.chiptuning_database?.vehicles?.length || 0
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 Chiptuning Calculator running on port ${PORT}`);
    console.log(`📊 Loaded ${chiptuningData.chiptuning_database?.vehicles?.length || 0} vehicles`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});