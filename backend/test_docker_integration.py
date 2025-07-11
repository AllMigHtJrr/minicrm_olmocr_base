#!/usr/bin/env python3
"""
Test script for Docker OLM OCR integration
"""

import asyncio
import logging
from pathlib import Path
from docker_olmocr import docker_olmocr_extraction, docker_olmocr

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_docker_availability():
    """Test if Docker and OLM OCR image are available"""
    logger.info("🔍 Testing Docker availability...")
    
    try:
        available = await docker_olmocr.check_docker_available()
        if available:
            logger.info("✅ Docker and OLM OCR image are available")
            return True
        else:
            logger.error("❌ Docker or OLM OCR image not available")
            return False
    except Exception as e:
        logger.error(f"❌ Error checking Docker availability: {e}")
        return False

async def test_document_processing():
    """Test document processing with a sample image"""
    logger.info("🔍 Testing document processing...")
    
    # Check if we have a test image
    test_images = [
        "resume_optimized.png",
        "uploads/resume_optimized.png",
        "Senior-Test-Engineer-Resume-Example.png",
        "uploads/Senior-Test-Engineer-Resume-Example.png"
    ]
    
    test_file = None
    for img_path in test_images:
        if Path(img_path).exists():
            test_file = img_path
            break
    
    if not test_file:
        logger.error("❌ No test image found. Please place a test image in the backend directory.")
        return False
    
    logger.info(f"📄 Using test file: {test_file}")
    
    try:
        # Read the test file
        with open(test_file, 'rb') as f:
            content = f.read()
        
        # Process with Docker OLM OCR
        logger.info("🔄 Processing document with Docker OLM OCR...")
        result = await docker_olmocr_extraction(content, Path(test_file).name)
        
        # Check results
        if "error" in result:
            logger.error(f"❌ Processing failed: {result['error']}")
            return False
        
        logger.info("✅ Document processing completed successfully")
        logger.info(f"📊 Extracted data:")
        logger.info(f"   Name: {result.get('name', 'Not found')}")
        logger.info(f"   Email: {result.get('email', 'Not found')}")
        logger.info(f"   Phone: {result.get('phone', 'Not found')}")
        logger.info(f"   Confidence: {result.get('confidence', 0):.2f}")
        logger.info(f"   Source: {result.get('source', 'Unknown')}")
        
        if result.get('raw_text'):
            logger.info(f"   Raw text length: {len(result['raw_text'])} characters")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error during document processing: {e}")
        return False

async def main():
    """Main test function"""
    logger.info("🚀 Starting Docker OLM OCR integration test...")
    
    # Test 1: Docker availability
    docker_ok = await test_docker_availability()
    if not docker_ok:
        logger.error("❌ Docker test failed. Cannot proceed with document processing test.")
        return
    
    # Test 2: Document processing
    processing_ok = await test_document_processing()
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("📋 TEST SUMMARY")
    logger.info("="*50)
    logger.info(f"Docker Availability: {'✅ PASS' if docker_ok else '❌ FAIL'}")
    logger.info(f"Document Processing: {'✅ PASS' if processing_ok else '❌ FAIL'}")
    
    if docker_ok and processing_ok:
        logger.info("🎉 All tests passed! Docker OLM OCR integration is working correctly.")
    else:
        logger.error("💥 Some tests failed. Please check the logs above for details.")

if __name__ == "__main__":
    asyncio.run(main()) 