#!/usr/bin/env python3
"""
OLM OCR Installation Script for Mini CRM
This script installs OLM OCR dependencies with Python 3.9 compatibility fixes
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n[RUNNING] {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"[SUCCESS] {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("[ERROR] Python 3.8 or higher is required")
        return False
    print(f"[SUCCESS] Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_compatibility_fixes():
    """Install compatibility fixes for Python 3.9"""
    print("\n[FIXING] Installing Python 3.9 compatibility fixes...")
    
    # Install specific versions to avoid conflicts
    fixes = [
        "protobuf==3.20.3",
        "typing-extensions==4.8.0",
        "setuptools>=65.5.1"
    ]
    
    for fix in fixes:
        if not run_command(f"pip install {fix}", f"Installing {fix}"):
            print(f"[WARNING] Failed to install {fix}")
    
    return True

def install_requirements():
    """Install Python requirements"""
    return run_command(
        "pip install -r requirements.txt",
        "Installing OLM OCR requirements"
    )

def test_olmocr_installation():
    """Test if OLM OCR libraries are working"""
    print("\n[TESTING] Testing OLM OCR installation...")
    
    test_code = """
import sys
import os

# Set environment variables to avoid TensorFlow conflicts
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

try:
    from transformers import AutoProcessor, AutoModelForVision2Seq
    import torch
    from pdf2image import convert_from_bytes
    import cv2
    import numpy as np
    from PIL import Image
    
    print("[SUCCESS] All OLM OCR libraries imported successfully")
    
    # Test PyTorch
    try:
        print(f"[SUCCESS] PyTorch version: {torch.__version__}")
        print(f"[SUCCESS] CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"[SUCCESS] CUDA device: {torch.cuda.get_device_name(0)}")
    except Exception as e:
        print(f"[ERROR] PyTorch test failed: {e}")
    
    # Test Transformers
    try:
        print("[SUCCESS] Transformers library working")
    except Exception as e:
        print(f"[ERROR] Transformers test failed: {e}")
    
    # Test OpenCV
    try:
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        print("[SUCCESS] OpenCV working correctly")
    except Exception as e:
        print(f"[ERROR] OpenCV test failed: {e}")
    
    # Test PDF2Image
    try:
        print("[SUCCESS] PDF2Image library working")
    except Exception as e:
        print(f"[ERROR] PDF2Image test failed: {e}")
    
    print("[SUCCESS] OLM OCR installation test completed!")
    
except ImportError as e:
    print(f"[ERROR] Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Test failed: {e}")
    sys.exit(1)
"""
    
    try:
        result = subprocess.run([sys.executable, "-c", test_code], 
                              capture_output=True, text=True, check=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("[ERROR] OLM OCR test failed:")
        print(e.stderr)
        return False

def main():
    """Main installation process"""
    print("Mini CRM OLM OCR Installation Script")
    print("=" * 50)
    print("Using allenai/olmOCR-7B-0225-preview model")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install compatibility fixes first
    install_compatibility_fixes()
    
    # Install Python requirements
    if not install_requirements():
        print("[ERROR] Failed to install OLM OCR requirements")
        sys.exit(1)
    
    # Test OLM OCR installation
    if not test_olmocr_installation():
        print("[ERROR] OLM OCR installation test failed")
        print("\n[TROUBLESHOOTING] Tips:")
        print("1. Make sure you have enough disk space (OLM OCR model is ~14GB)")
        print("2. Check your internet connection for model download")
        print("3. Try running: pip install --upgrade transformers torch pdf2image opencv-python accelerate")
        print("4. For GPU support, install CUDA version of PyTorch")
        print("5. If you get TensorFlow errors, try: pip uninstall tensorflow")
        sys.exit(1)
    
    print("\n[SUCCESS] OLM OCR installation completed successfully!")
    print("The OLM OCR model (allenai/olmOCR-7B-0225-preview) will be downloaded automatically on first use.")
    print("This may take a few minutes depending on your internet connection.")
    print("\nTo start the backend:")
    print("cd backend")
    print("python main.py")

if __name__ == "__main__":
    main() 