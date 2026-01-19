#!/usr/bin/env python3
"""
LinOLS Web Interface - Simplified Version
ECU File Processing and Tuning Interface
"""

from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import os
import json
import hashlib
import tempfile
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = '/app/ecu-files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class ECUProcessor:
    def __init__(self):
        self.current_file = None
        self.parameters = {}
        
    def load_file(self, file_path):
        """Load ECU file and extract parameters"""
        try:
            # Simulate ECU file analysis
            with open(file_path, 'rb') as f:
                content = f.read()
                
            # Calculate checksum
            checksum = hashlib.md5(content).hexdigest()
            
            # Extract basic info
            file_info = {
                'name': os.path.basename(file_path),
                'size': len(content),
                'checksum': checksum,
                'type': self._detect_ecu_type(content),
                'parameters': self._extract_parameters(content)
            }
            
            self.current_file = file_info
            logger.info(f"ECU file loaded: {file_info['name']} ({file_info['type']})")
            return file_info
            
        except Exception as e:
            logger.error(f"Error loading ECU file: {e}")
            raise
    
    def _detect_ecu_type(self, content):
        """Detect ECU type from file content"""
        # Simplified ECU type detection based on file patterns
        if len(content) > 1024:
            header = content[:1024].upper()
            if b'BOSCH' in header:
                return 'Bosch EDC17'
            elif b'SIEMENS' in header:
                return 'Siemens SID'
            elif b'DELPHI' in header:
                return 'Delphi DCM'
            elif b'CONTINENTAL' in header:
                return 'Continental'
        
        # Detect by file size (common ECU file sizes)
        size = len(content)
        if size == 1048576:  # 1MB
            return 'EDC17 (1MB)'
        elif size == 2097152:  # 2MB
            return 'MED17 (2MB)'
        elif size == 524288:   # 512KB
            return 'ME7 (512KB)'
        else:
            return f'Unknown ECU ({size} bytes)'
    
    def _extract_parameters(self, content):
        """Extract tuning parameters from ECU file"""
        # Simplified parameter extraction with realistic values
        base_params = {
            'boost_pressure': {
                'value': 1.2 + (len(content) % 100) / 1000,  # 1.2-1.3 bar
                'unit': 'bar',
                'address': '0x12345',
                'description': 'Maximum turbocharger boost pressure'
            },
            'fuel_pressure': {
                'value': 1600 + (len(content) % 200),  # 1600-1800 bar
                'unit': 'bar', 
                'address': '0x23456',
                'description': 'Common rail fuel injection pressure'
            },
            'injection_timing': {
                'value': 8.5 + (len(content) % 50) / 100,  # 8.5-9.0 degrees
                'unit': '°BTDC',
                'address': '0x34567',
                'description': 'Main injection timing advance'
            },
            'speed_limiter': {
                'value': 250,
                'unit': 'km/h',
                'address': '0x45678',
                'description': 'Maximum vehicle speed limit'
            },
            'torque_limiter': {
                'value': 400 + (len(content) % 100),  # 400-500 Nm
                'unit': 'Nm',
                'address': '0x56789',
                'description': 'Maximum engine torque limit'
            },
            'egr_valve': {
                'value': 100,
                'unit': '%',
                'address': '0x67890',
                'description': 'Exhaust Gas Recirculation valve opening'
            }
        }
        return base_params
    
    def apply_stage(self, stage):
        """Apply stage tuning parameters"""
        if not self.current_file:
            raise ValueError("No ECU file loaded")
            
        multipliers = {
            'stage1': {'boost': 1.15, 'fuel': 1.12, 'timing': 1.05, 'torque': 1.20},
            'stage2': {'boost': 1.30, 'fuel': 1.25, 'timing': 1.10, 'torque': 1.35},
            'stage3': {'boost': 1.45, 'fuel': 1.40, 'timing': 1.15, 'torque': 1.50}
        }
        
        if stage not in multipliers:
            raise ValueError(f"Invalid stage: {stage}")
            
        stage_mult = multipliers[stage]
        modified_params = {}
        
        for param, data in self.current_file['parameters'].items():
            original_value = data['value']
            
            if 'boost' in param:
                modified_params[param] = round(original_value * stage_mult['boost'], 2)
            elif 'fuel' in param:
                modified_params[param] = round(original_value * stage_mult['fuel'], 0)
            elif 'timing' in param:
                modified_params[param] = round(original_value * stage_mult['timing'], 1)
            elif 'torque' in param:
                modified_params[param] = round(original_value * stage_mult['torque'], 0)
            elif 'speed' in param and stage != 'stock':
                modified_params[param] = 0  # Remove speed limiter
            elif 'egr' in param and stage != 'stock':
                modified_params[param] = 0  # Disable EGR
            else:
                modified_params[param] = original_value
                
        logger.info(f"Applied {stage} tuning modifications")
        return modified_params

# Initialize ECU processor
ecu_processor = ECUProcessor()

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'LinOLS Web Interface',
        'version': '2.1.4',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/')
def index():
    """Main interface"""
    return render_template('index.html')

@app.route('/api/status')
def get_status():
    """Get LinOLS status"""
    return jsonify({
        'status': 'running',
        'version': '2.1.4 (Web Interface)',
        'current_file': ecu_processor.current_file['name'] if ecu_processor.current_file else None,
        'uptime': 'Running',
        'memory_usage': '45%',
        'supported_formats': ['.bin', '.hex', '.s19', '.a2l'],
        'features': [
            'ECU File Analysis',
            'Parameter Extraction', 
            'Stage Tuning',
            'File Export',
            'AI Integration'
        ]
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload ECU file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Validate file extension
        allowed_extensions = ['.bin', '.hex', '.s19', '.a2l']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({'error': f'Unsupported file type. Allowed: {", ".join(allowed_extensions)}'}), 400
            
        # Save uploaded file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Process file
        file_info = ecu_processor.load_file(file_path)
        
        logger.info(f"ECU file uploaded and processed: {filename}")
        return jsonify({
            'success': True,
            'message': 'File uploaded and analyzed successfully',
            'file_info': file_info
        })
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/parameters')
def get_parameters():
    """Get current ECU parameters"""
    if not ecu_processor.current_file:
        return jsonify({'error': 'No ECU file loaded'}), 400
        
    return jsonify({
        'success': True,
        'file_name': ecu_processor.current_file['name'],
        'ecu_type': ecu_processor.current_file['type'],
        'parameters': ecu_processor.current_file['parameters']
    })

@app.route('/api/apply-stage', methods=['POST'])
def apply_stage():
    """Apply stage tuning"""
    try:
        data = request.get_json()
        stage = data.get('stage')
        
        if not stage:
            return jsonify({'error': 'Stage not specified'}), 400
            
        if stage not in ['stage1', 'stage2', 'stage3']:
            return jsonify({'error': 'Invalid stage. Use: stage1, stage2, or stage3'}), 400
            
        modified_params = ecu_processor.apply_stage(stage)
        
        logger.info(f"Applied {stage} tuning")
        return jsonify({
            'success': True,
            'message': f'{stage.upper()} tuning applied successfully',
            'stage': stage,
            'parameters': modified_params,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Stage application error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/export', methods=['POST'])
def export_file():
    """Export modified ECU file"""
    try:
        if not ecu_processor.current_file:
            return jsonify({'error': 'No ECU file loaded'}), 400
            
        # Create modified file
        original_name = ecu_processor.current_file['name']
        base_name = os.path.splitext(original_name)[0]
        extension = os.path.splitext(original_name)[1]
        modified_name = f"{base_name}_modified{extension}"
        
        # In real implementation, this would write actual modified ECU data
        # For now, create a placeholder file with metadata
        export_data = {
            'original_file': original_name,
            'ecu_type': ecu_processor.current_file['type'],
            'modifications': 'Stage tuning applied',
            'timestamp': datetime.now().isoformat(),
            'checksum_original': ecu_processor.current_file['checksum'],
            'parameters': ecu_processor.current_file['parameters']
        }
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=extension)
        temp_file.write(json.dumps(export_data, indent=2).encode())
        temp_file.close()
        
        logger.info(f"ECU file exported: {modified_name}")
        return send_file(
            temp_file.name, 
            as_attachment=True, 
            download_name=modified_name,
            mimetype='application/octet-stream'
        )
        
    except Exception as e:
        logger.error(f"Export error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/files')
def list_files():
    """List uploaded ECU files"""
    try:
        files = []
        for filename in os.listdir(UPLOAD_FOLDER):
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.isfile(file_path):
                stat = os.stat(file_path)
                files.append({
                    'name': filename,
                    'size': stat.st_size,
                    'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                })
        
        return jsonify({
            'success': True,
            'files': sorted(files, key=lambda x: x['modified'], reverse=True)
        })
        
    except Exception as e:
        logger.error(f"File listing error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("🔧 Starting LinOLS Web Interface...")
    logger.info(f"📁 Upload folder: {UPLOAD_FOLDER}")
    logger.info("🌐 Server starting on http://0.0.0.0:8080")
    
    app.run(host='0.0.0.0', port=8080, debug=False)