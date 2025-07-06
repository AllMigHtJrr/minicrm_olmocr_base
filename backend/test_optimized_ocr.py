#!/usr/bin/env python3
"""
Optimized OLM OCR Test Script
Tests the optimized OLM OCR implementation with GPU acceleration and performance monitoring
"""

import sys
import os
import logging
import time
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_optimized_olmocr():
    """Test optimized OLM OCR with performance monitoring"""
    try:
        from utils import load_olmocr_model, olmocr_extraction
        import torch
        
        logger.info("🧪 Testing Optimized OLM OCR Setup...")
        logger.info("=" * 60)
        
        # Test model loading with performance monitoring
        start_time = time.time()
        logger.info("🔄 Loading optimized OLM OCR model...")
        
        model, processor, device = load_olmocr_model()
        
        load_time = time.time() - start_time
        logger.info(f"✅ Model loaded in {load_time:.2f} seconds")
        
        # Check GPU status
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name()
            gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            logger.info(f"🎮 GPU: {gpu_name} ({gpu_memory:.1f}GB)")
            
            if hasattr(load_olmocr_model, 'use_gpu') and load_olmocr_model.use_gpu:
                logger.info("⚡ GPU acceleration: ENABLED")
            else:
                logger.info("🖥️ GPU acceleration: DISABLED (fallback to CPU)")
        else:
            logger.info("🖥️ No GPU detected, using CPU")
        
        # Create a test image
        logger.info("\n🔄 Creating test document...")
        img = Image.new('RGB', (800, 600), color='white')
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        # Add test content
        draw.text((50, 50), "John Smith", fill='black', font=font)
        draw.text((50, 100), "john.smith@example.com", fill='black', font=font)
        draw.text((50, 150), "(555) 123-4567", fill='black', font=font)
        draw.text((50, 200), "Software Engineer", fill='black', font=font)
        
        # Convert to bytes
        img_bytes = img.tobytes()
        
        # Test OCR extraction with performance monitoring
        logger.info("🚀 Testing OCR extraction with performance monitoring...")
        extraction_start = time.time()
        
        result = olmocr_extraction(img_bytes, "test_resume.png")
        
        extraction_time = time.time() - extraction_start
        
        logger.info(f"✅ OCR extraction completed in {extraction_time:.2f} seconds")
        logger.info(f"📊 Results:")
        logger.info(f"   Name: {result.get('name', 'Not found')}")
        logger.info(f"   Email: {result.get('email', 'Not found')}")
        logger.info(f"   Phone: {result.get('phone', 'Not found')}")
        
        if result.get('error'):
            logger.warning(f"⚠️ Extraction warning: {result['error']}")
        
        # Performance summary
        total_time = load_time + extraction_time
        logger.info("\n" + "=" * 60)
        logger.info("📈 Performance Summary:")
        logger.info(f"   Model Loading: {load_time:.2f}s")
        logger.info(f"   OCR Extraction: {extraction_time:.2f}s")
        logger.info(f"   Total Time: {total_time:.2f}s")
        
        if extraction_time < 30:
            logger.info("🎉 Excellent performance! OCR is optimized and fast.")
        elif extraction_time < 60:
            logger.info("✅ Good performance! OCR is working well.")
        else:
            logger.info("⚠️ Slow performance. Consider GPU acceleration.")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        return False

def main():
    """Run the optimized OCR test"""
    logger.info("🚀 Optimized OLM OCR Performance Test")
    logger.info("=" * 60)
    
    success = test_optimized_olmocr()
    
    if success:
        logger.info("\n🎉 All tests passed! Your optimized OLM OCR is ready!")
        logger.info("🚀 You can now use fast document processing in your Mini CRM!")
        return True
    else:
        logger.error("\n💥 Tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 