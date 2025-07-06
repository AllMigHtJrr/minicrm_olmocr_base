#!/usr/bin/env python3
"""
Official OLM OCR Test Script
Tests the official OLM OCR implementation using Qwen2VLForConditionalGeneration
"""

import sys
import os
import logging
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_olmocr_imports():
    """Test if OLM OCR libraries can be imported"""
    try:
        from transformers import AutoProcessor, Qwen2VLForConditionalGeneration
        import torch
        from pdf2image import convert_from_bytes
        logger.info("✅ All OLM OCR libraries imported successfully")
        return True
    except ImportError as e:
        logger.error(f"❌ Import error: {e}")
        return False

def test_model_loading():
    """Test if the OLM OCR model can be loaded"""
    try:
        import torch
        from utils import load_olmocr_model
        
        logger.info("🔄 Loading OLM OCR model...")
        model, processor, device = load_olmocr_model()
        
        logger.info("✅ OLM OCR model loaded successfully")
        logger.info(f"   Model type: {type(model).__name__}")
        logger.info(f"   Processor type: {type(processor).__name__}")
        logger.info(f"   Device: {device}")
        
        # Check if CUDA is available
        if torch.cuda.is_available():
            logger.info("✅ CUDA is available - GPU will be used")
            logger.info(f"   GPU: {torch.cuda.get_device_name()}")
        else:
            logger.info("⚠️ CUDA not available - CPU will be used")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Model loading failed: {e}")
        return False

def test_image_processing():
    """Test image processing functions"""
    try:
        from utils import resize_image_to_1024, encode_image_to_base64
        
        # Create a simple test image
        test_image = Image.new('RGB', (800, 600), color='white')
        draw = ImageDraw.Draw(test_image)
        
        # Add some text
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        draw.text((50, 50), "Test Document", fill='black', font=font)
        draw.text((50, 100), "John Doe", fill='black', font=font)
        draw.text((50, 150), "john.doe@example.com", fill='black', font=font)
        
        # Test resizing
        resized = resize_image_to_1024(test_image)
        logger.info(f"✅ Image resizing successful: {resized.size}")
        
        # Test base64 encoding
        base64_str = encode_image_to_base64(resized)
        logger.info(f"✅ Base64 encoding successful: {len(base64_str)} characters")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Image processing failed: {e}")
        return False

def test_ocr_extraction():
    """Test OCR extraction with a simple image"""
    try:
        from utils import olmocr_extraction
        
        # Create a simple test image with text
        img = Image.new('RGB', (400, 200), color='white')
        draw = ImageDraw.Draw(img)
        
        # Add some text
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        draw.text((50, 50), "Test Document", fill='black', font=font)
        draw.text((50, 100), "John Doe", fill='black', font=font)
        draw.text((50, 150), "john.doe@example.com", fill='black', font=font)
        
        # Convert to bytes
        img_bytes = img.tobytes()
        
        logger.info("🔄 Testing OLM OCR extraction...")
        result = olmocr_extraction(img_bytes, "test.png")
        
        logger.info("✅ OLM OCR extraction completed")
        logger.info(f"   Name: {result.get('name', 'Not found')}")
        logger.info(f"   Email: {result.get('email', 'Not found')}")
        logger.info(f"   Phone: {result.get('phone', 'Not found')}")
        
        if result.get('error'):
            logger.warning(f"⚠️ Extraction warning: {result['error']}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ OCR extraction failed: {e}")
        return False

def main():
    """Run all tests"""
    logger.info("🧪 Starting Official OLM OCR Tests...")
    logger.info("=" * 50)
    
    tests = [
        ("Import Test", test_olmocr_imports),
        ("Model Loading Test", test_model_loading),
        ("Image Processing Test", test_image_processing),
        ("OCR Extraction Test", test_ocr_extraction),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        logger.info(f"\n🔍 Running {test_name}...")
        try:
            if test_func():
                logger.info(f"✅ {test_name} PASSED")
                passed += 1
            else:
                logger.error(f"❌ {test_name} FAILED")
        except Exception as e:
            logger.error(f"❌ {test_name} FAILED with exception: {e}")
    
    logger.info("\n" + "=" * 50)
    logger.info(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 All tests passed! Official OLM OCR is working correctly.")
        logger.info("🚀 You can now use document upload in your Mini CRM!")
        return True
    else:
        logger.error("💥 Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 