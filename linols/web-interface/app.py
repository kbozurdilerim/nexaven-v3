#!/usr/bin/env python3
"""
LinOLS Web Interface
ECU File Processing and Tuning Interface
"""

from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import os
import json
import hashlib
import subprocess
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
LINOLS_PATH = '/app/linols'
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
            return file_info
            
        except Exception as e:
            logger.error(f"Error loading ECU file: {e}")
            raise
    
    def _detect_ecu_type(self, content):
        """Detect ECU type from file content"""
        # Simplified ECU type detection
        if b'BOSCH' in content[:1024]:
            return 'Bosch EDC17'
        elif b'SIEMENS' in content[:1024]:
            return 'Siemens SID'
        elif b'DELPHI' in content[:1024]:
            return 'Delphi DCM'
        else:
            return 'Unknown ECU'
    
    def _extract_parameters(self, content):
        """Extract tuning parameters from ECU file"""
        # Simplified parameter extraction
        return {
            'boost_pressure': {'value': 1.2, 'unit': 'bar', 'address': '0x12345'},
            'fuel_pressure': {'value': 1600, 'unit': 'bar', 'address': '0x23456'},
            'injection_timing': {'value': 8.5, 'unit': '°BTDC', 'address': '0x34567'},
            'speed_limiter': {'value': 250, 'unit': 'km/h', 'address': '0x45678'},
            'torque_limiter': {'value': 400, 'unit': 'Nm', 'address': '0x56789'}
        }
    
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
            if 'boost' in param:
                modified_params[param] = data['value'] * stage_mult['boost']
            elif 'fuel' in param:
                modified_params[param] = data['value'] * stage_mult['fuel']
            elif 'timing' in param:
                modified_params[param] = data['value'] * stage_mult['timing']
            elif 'torque' in param:
                modified_params[param] = data['value'] * stage_mult['torque']
            elif 'speed' in param and stage != 'stock':
                modified_params[param] = 0  # Remove speed limiter
            else:
                modified_params[param] = data['value']
                
        return modified_params

# Initialize ECU processor
ecu_processor = ECUProcessor()

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/')
def index():
    """Main interface"""
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload ECU file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Save uploaded file
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Process file
        file_info = ecu_processor.load_file(file_path)
        
        logger.info(f"ECU file uploaded and processed: {filename}")
        return jsonify({
            'success': True,
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
        
    return jsonify(ecu_processor.current_file['parameters'])

@app.route('/api/apply-stage', methods=['POST'])
def apply_stage():
    """Apply stage tuning"""
    try:
        data = request.get_json()
        stage = data.get('stage')
        
        if not stage:
            return jsonify({'error': 'Stage not specified'}), 400
            
        modified_params = ecu_processor.apply_stage(stage)
        
        logger.info(f"Applied {stage} tuning")
        return jsonify({
            'success': True,
            'stage': stage,
            'parameters': modified_params
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
            
        # Create modified file (simplified)
        original_name = ecu_processor.current_file['name']
        modified_name = original_name.replace('.bin', '_modified.bin')
        
        # In real implementation, this would write actual modified ECU data
        modified_content = f"Modified ECU file - {datetime.now().isoformat()}"
        
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.bin')
        temp_file.write(modified_content.encode())
        temp_file.close()
        
        logger.info(f"ECU file exported: {modified_name}")
        return send_file(temp_file.name, as_attachment=True, download_name=modified_name)
        
    except Exception as e:
        logger.error(f"Export error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/status')
def get_status():
    """Get LinOLS status"""
    return jsonify({
        'status': 'running',
        'version': '2.1.4',
        'current_file': ecu_processor.current_file['name'] if ecu_processor.current_file else None,
        'uptime': 'Running',
        'memory_usage': '45%'
    })

if __name__ == '__main__':
    logger.info("Starting LinOLS Web Interface...")
    app.run(host='0.0.0.0', port=8080, debug=False)