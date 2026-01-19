class ForceChiptuningApp {
    constructor() {
        this.selectedVehicle = null;
        this.basePath = this.getBasePath();
        this.init();
    }

    getBasePath() {
        // Detect if running under a subpath
        const path = window.location.pathname;
        if (path.startsWith('/chiptuning')) {
            return '/chiptuning';
        } else if (path.startsWith('/force')) {
            return '/force';
        }
        return '';
    }

    async init() {
        this.setupEventListeners();
        await this.loadBrands();
        await this.loadStats();
        this.initAnimations();
    }

    initAnimations() {
        // Add entrance animations to elements
        const elements = document.querySelectorAll('.fade-in-up');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });

        // Add glitch effect to random elements
        setInterval(() => {
            const glitchElements = document.querySelectorAll('.glitch');
            glitchElements.forEach(el => {
                if (Math.random() > 0.95) {
                    el.style.animation = 'none';
                    setTimeout(() => {
                        el.style.animation = 'glitch 2s linear infinite';
                    }, 100);
                }
            });
        }, 3000);
    }

    setupEventListeners() {
        // Search input with enhanced effects
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('neon-glow');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('neon-glow');
        });

        // Brand selection
        const brandSelect = document.getElementById('brandSelect');
        brandSelect.addEventListener('change', this.handleBrandChange.bind(this));

        // Model selection
        const modelSelect = document.getElementById('modelSelect');
        modelSelect.addEventListener('change', this.handleModelChange.bind(this));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async loadBrands() {
        try {
            const response = await fetch(`${this.basePath}/api/brands`);
            const data = await response.json();
            
            if (data.success) {
                const brandSelect = document.getElementById('brandSelect');
                brandSelect.innerHTML = '<option value="" class="bg-gray-900 text-white">Marka seçin...</option>';
                
                data.brands.forEach(brand => {
                    const option = document.createElement('option');
                    option.className = 'bg-gray-900 text-white';
                    option.value = brand;
                    option.textContent = brand;
                    option.className = 'bg-gray-900 text-white';
                    brandSelect.appendChild(option);
                });

                // Add loading animation
                brandSelect.classList.add('slide-in-left');
            }
        } catch (error) {
            console.error('Error loading brands:', error);
            this.showNotification('Markalar yüklenirken hata oluştu', 'error');
        }
    }

    async handleBrandChange(event) {
        const brand = event.target.value;
        const modelSelect = document.getElementById('modelSelect');
        
        if (!brand) {
            modelSelect.innerHTML = '<option value="" class="bg-gray-900 text-white">Önce marka seçin...</option>';
            modelSelect.disabled = true;
            return;
        }

        // Add loading effect
        modelSelect.innerHTML = '<option value="" class="bg-gray-900 text-white">Yükleniyor...</option>';
        modelSelect.classList.add('pulse-animation');

        try {
            const response = await fetch(`${this.basePath}/api/models/${encodeURIComponent(brand)}`);
            const data = await response.json();
            
            if (data.success) {
                modelSelect.innerHTML = '<option value="" class="bg-gray-900 text-white">Model seçin...</option>';
                
                data.models.forEach(model => {
                    const option = document.createElement('option');
                    option.className = 'bg-gray-900 text-white';
                    option.value = model.id;
                    option.textContent = `${model.model} ${model.year} (${model.engine})`;
                    option.className = 'bg-gray-900 text-white';
                    modelSelect.appendChild(option);
                });
                
                modelSelect.disabled = false;
                modelSelect.classList.remove('pulse-animation');
                modelSelect.classList.add('slide-in-right');
            }
        } catch (error) {
            console.error('Error loading models:', error);
            modelSelect.innerHTML = '<option value="" class="bg-gray-900 text-white">Hata oluştu</option>';
            modelSelect.classList.remove('pulse-animation');
            this.showNotification('Modeller yüklenirken hata oluştu', 'error');
        }
    }

    async handleModelChange(event) {
        const vehicleId = event.target.value;
        
        if (!vehicleId) {
            this.hideVehicleInfo();
            return;
        }

        await this.loadVehicleInfo(vehicleId);
    }

    async handleSearch(event) {
        const query = event.target.value.trim();
        const resultsContainer = document.getElementById('searchResults');
        const resultsList = document.getElementById('searchResultsList');
        
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`${this.basePath}/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.results.length > 0) {
                resultsList.innerHTML = '';
                
                data.results.forEach((vehicle, index) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'p-4 bg-gray-900/60 border border-purple-500/20 rounded-xl cursor-pointer hover:bg-purple-900/20 hover:border-purple-400/40 transition-all duration-300 card-hover';
                    resultItem.style.animationDelay = `${index * 0.1}s`;
                    resultItem.classList.add('fade-in-up');
                    
                    resultItem.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">
                                <div class="w-3 h-3 bg-purple-500 rounded-full pulse-animation"></div>
                                <div>
                                    <span class="font-medium text-white">${vehicle.brand} ${vehicle.model}</span>
                                    <span class="text-purple-300 ml-2">${vehicle.year}</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm text-purple-300">${vehicle.engine}</div>
                                <div class="text-xs text-gray-400">${vehicle.original_hp} HP</div>
                            </div>
                        </div>
                    `;
                    
                    resultItem.addEventListener('click', () => {
                        this.loadVehicleInfo(vehicle.id);
                        resultsContainer.classList.add('hidden');
                        document.getElementById('searchInput').value = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
                        this.showNotification(`${vehicle.brand} ${vehicle.model} seçildi`, 'success');
                    });
                    
                    resultsList.appendChild(resultItem);
                });
                
                resultsContainer.classList.remove('hidden');
                resultsContainer.classList.add('fade-in-up');
            } else {
                resultsContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error searching:', error);
            this.showNotification('Arama sırasında hata oluştu', 'error');
        }
    }

    async loadVehicleInfo(vehicleId) {
        try {
            // Show loading animation
            const vehicleInfo = document.getElementById('vehicleInfo');
            vehicleInfo.innerHTML = `
                <div class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <span class="ml-4 text-purple-300">Force Engine analiz ediyor...</span>
                </div>
            `;
            vehicleInfo.classList.remove('hidden');

            const response = await fetch(`${this.basePath}/api/vehicle/${vehicleId}`);
            const data = await response.json();
            
            if (data.success) {
                this.selectedVehicle = data.vehicle;
                this.displayVehicleInfo();
                this.displayTuningStages();
                this.showNotification('Araç bilgileri yüklendi', 'success');
            }
        } catch (error) {
            console.error('Error loading vehicle info:', error);
            this.showNotification('Araç bilgileri yüklenirken hata oluştu', 'error');
        }
    }

    displayVehicleInfo() {
        const vehicle = this.selectedVehicle;
        const container = document.getElementById('vehicleDetails');
        
        container.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4 slide-in-left">
                    <h3 class="text-2xl font-bold text-purple-300 glitch" data-text="${vehicle.brand} ${vehicle.model}">${vehicle.brand} ${vehicle.model}</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-gray-900/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-calendar mr-2"></i>Yıl:</span>
                            <span class="font-medium text-purple-300">${vehicle.year}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-cog mr-2"></i>Motor:</span>
                            <span class="font-medium text-purple-300">${vehicle.engine}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-gas-pump mr-2"></i>Yakıt Türü:</span>
                            <span class="font-medium text-purple-300">${vehicle.fuel_type}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-tachometer-alt mr-2"></i>Hacim:</span>
                            <span class="font-medium text-purple-300">${vehicle.displacement || 'N/A'} cc</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-4 slide-in-right">
                    <h4 class="text-2xl font-bold text-green-300">Orijinal Performans</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-4 bg-gray-900/60 rounded-lg border border-green-500/20 neon-glow">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-bolt mr-2"></i>Güç:</span>
                            <span class="font-bold text-2xl text-blue-400">${vehicle.original_specs.hp} HP</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-gray-900/60 rounded-lg border border-green-500/20 neon-glow">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-wrench mr-2"></i>Tork:</span>
                            <span class="font-bold text-2xl text-green-400">${vehicle.original_specs.torque} Nm</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-gray-900/60 rounded-lg border border-green-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-leaf mr-2"></i>Yakıt Tüketimi:</span>
                            <span class="font-medium text-purple-300">${vehicle.original_specs.fuel_consumption || 'N/A'} L/100km</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${vehicle.ecu_info ? `
            <div class="mt-8 p-6 bg-gray-900/60 rounded-xl border border-blue-500/20 neon-glow">
                <h4 class="font-bold text-xl text-blue-300 mb-4 flex items-center">
                    <i class="fas fa-microchip mr-2"></i>Force ECU Bilgileri
                </h4>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center p-4 bg-gray-800/60 rounded-lg border border-blue-500/20">
                        <div class="text-sm text-gray-400 mb-1">ECU Tipi</div>
                        <div class="font-medium text-blue-300">${vehicle.ecu_info.type}</div>
                    </div>
                    <div class="text-center p-4 bg-gray-800/60 rounded-lg border border-blue-500/20">
                        <div class="text-sm text-gray-400 mb-1">Zorluk</div>
                        <div class="font-medium ${this.getDifficultyColor(vehicle.ecu_info.difficulty)}">${vehicle.ecu_info.difficulty}</div>
                    </div>
                    <div class="text-center p-4 bg-gray-800/60 rounded-lg border border-blue-500/20">
                        <div class="text-sm text-gray-400 mb-1">Okuma Yöntemi</div>
                        <div class="font-medium text-blue-300">${vehicle.ecu_info.read_method}</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${vehicle.notes ? `
            <div class="mt-6 p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg">
                <p class="text-blue-300 flex items-center">
                    <i class="fas fa-info-circle mr-2 text-blue-400"></i> 
                    <strong>Force Note:</strong> ${vehicle.notes}
                </p>
            </div>
            ` : ''}
        `;
        
        document.getElementById('vehicleInfo').classList.remove('hidden');
    }

    displayTuningStages() {
        const vehicle = this.selectedVehicle;
        const container = document.getElementById('stageCards');
        
        container.innerHTML = '';
        
        Object.entries(vehicle.calculated_stages).forEach(([stageName, stageData], index) => {
            const stageNumber = stageName.replace('stage', '');
            const stageCard = document.createElement('div');
            stageCard.className = `stage-card stage-${stageNumber} rounded-2xl p-8 card-hover relative overflow-hidden`;
            stageCard.style.animationDelay = `${index * 0.2}s`;
            stageCard.classList.add('fade-in-up');
            
            stageCard.innerHTML = `
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-white flex items-center">
                            <i class="fas fa-rocket mr-3 text-purple-400"></i>
                            Force Stage ${stageNumber}
                        </h3>
                        <div class="text-3xl font-bold text-green-400 neon-glow">₺${stageData.price.toLocaleString()}</div>
                    </div>
                    
                    <div class="space-y-4 mb-6">
                        <div class="flex justify-between items-center p-3 bg-gray-800/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-bolt mr-2"></i>Güç:</span>
                            <div class="text-right">
                                <span class="font-bold text-xl text-blue-400">${stageData.hp} HP</span>
                                <span class="text-sm text-green-400 ml-2 pulse-animation">(+${stageData.hp_gain_percent}%)</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-800/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-wrench mr-2"></i>Tork:</span>
                            <div class="text-right">
                                <span class="font-bold text-xl text-purple-400">${stageData.torque} Nm</span>
                                <span class="text-sm text-green-400 ml-2 pulse-animation">(+${stageData.torque_gain_percent}%)</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-800/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-leaf mr-2"></i>Yakıt İyileştirme:</span>
                            <span class="font-medium text-green-400">${stageData.fuel_improvement}%</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-800/60 rounded-lg border border-purple-500/20">
                            <span class="text-gray-400 flex items-center"><i class="fas fa-clock mr-2"></i>Tahmini Süre:</span>
                            <span class="font-medium text-purple-300">${stageData.estimated_time}</span>
                        </div>
                    </div>
                    
                    ${stageData.required_mods && stageData.required_mods.length > 0 ? `
                    <div class="border-t border-gray-700 pt-4 mb-6">
                        <h4 class="text-sm font-semibold text-purple-300 mb-3 flex items-center">
                            <i class="fas fa-tools mr-2"></i>Gerekli Force Modifikasyonlar:
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            ${stageData.required_mods.map(mod => 
                                `<span class="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">${mod}</span>`
                            ).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <button class="w-full force-gradient text-white py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg neon-glow">
                        <i class="fas fa-calculator mr-3"></i>Force Teklif Al
                    </button>
                </div>
                
                <!-- Animated background elements -->
                <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
                <div class="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/10 rounded-full blur-lg"></div>
            `;
            
            container.appendChild(stageCard);
        });
        
        document.getElementById('tuningStages').classList.remove('hidden');
    }

    getDifficultyColor(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-400';
            case 'medium': return 'text-yellow-400';
            case 'hard': return 'text-red-400';
            default: return 'text-gray-400';
        }
    }

    hideVehicleInfo() {
        document.getElementById('vehicleInfo').classList.add('hidden');
        document.getElementById('tuningStages').classList.add('hidden');
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.basePath}/api/stats`);
            const data = await response.json();
            
            if (data.success) {
                // Animate numbers counting up
                this.animateNumber('totalVehicles', data.stats.total_vehicles);
                this.animateNumber('totalBrands', data.stats.total_brands);
                document.getElementById('avgGain').textContent = `+${data.stats.avg_stage1_gain}%`;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showNotification('İstatistikler yüklenirken hata oluştu', 'error');
        }
    }

    animateNumber(elementId, targetNumber) {
        const element = document.getElementById(elementId);
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentNumber = Math.floor(progress * targetNumber);
            element.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        const colors = {
            success: 'bg-green-600 border-green-500 text-white',
            error: 'bg-red-600 border-red-500 text-white',
            info: 'bg-blue-600 border-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type]} border`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForceChiptuningApp();
});