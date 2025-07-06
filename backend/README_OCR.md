# OCR Installation Guide for Mini CRM

This guide will help you install and configure OCR (Optical Character Recognition) for the Mini CRM backend to enable document processing capabilities.

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

Run the automated installation script:

```bash
cd backend
python install_ocr.py
```

This script will:
- Check your Python version
- Install system dependencies (Tesseract)
- Install Python OCR libraries
- Test the installation

### Option 2: Manual Installation

If the automated script doesn't work, follow these manual steps:

## 📋 Prerequisites

- Python 3.8 or higher
- pip package manager
- Internet connection for downloading libraries

## 🛠️ System Dependencies

### Windows

1. **Install Tesseract:**
   - Download from: https://github.com/UB-Mannheim/tesseract/wiki
   - Choose the latest version (e.g., tesseract-ocr-w64-setup-5.3.1.20230401.exe)
   - Run the installer
   - **Important:** Add Tesseract to your PATH during installation

2. **Verify Installation:**
   ```cmd
   tesseract --version
   ```

### macOS

Using Homebrew:
```bash
brew install tesseract
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr tesseract-ocr-eng
```

### Linux (CentOS/RHEL)

```bash
sudo yum install -y tesseract
```

## 📦 Python Dependencies

Install the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```

Or install individually:

```bash
pip install easyocr pytesseract pdf2image opencv-python
```

## 🧪 Testing the Installation

Run the OCR test script to verify everything is working:

```bash
cd backend
python test_ocr.py
```

You should see output like:
```
🚀 Mini CRM OCR Test Script
========================================
🔍 Checking OCR availability...
✅ OCR libraries are available
✅ EasyOCR imported successfully
✅ PyTesseract imported successfully
✅ PDF2Image imported successfully
✅ OpenCV imported successfully

========================================
🧪 Testing OCR with generated image...
📄 OCR Results:
Name: John Smith
Email: john.smith@example.com
Phone: (555) 123-4567

✅ Image OCR test: PASSED
🎉 OCR is working! You can now use document upload in the Mini CRM.
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Tesseract not found" Error

**Solution:**
- Make sure Tesseract is installed and in your PATH
- On Windows, restart your terminal after installation
- Verify with: `tesseract --version`

#### 2. Import Errors

**Solution:**
```bash
pip install --upgrade easyocr pytesseract pdf2image opencv-python
```

#### 3. Memory Issues with Large Files

**Solution:**
- The OCR libraries will automatically handle memory management
- For very large PDFs, consider splitting them into smaller files

#### 4. Slow Processing

**Solution:**
- First run may be slow as models are downloaded
- Subsequent runs will be faster
- Consider using smaller images for testing

### Windows-Specific Issues

1. **Visual C++ Redistributable:**
   - Download and install from Microsoft's website if you get DLL errors

2. **PATH Issues:**
   - Make sure Tesseract is in your system PATH
   - Restart your terminal/IDE after installation

3. **Permission Issues:**
   - Run terminal as Administrator if needed

### macOS-Specific Issues

1. **Homebrew Issues:**
   ```bash
   brew doctor
   brew update
   brew install tesseract
   ```

2. **Permission Issues:**
   ```bash
   sudo chown -R $(whoami) /usr/local/lib/python3.x/site-packages
   ```

## 📚 Supported File Formats

- **Images:** PNG, JPG, JPEG
- **Documents:** PDF
- **Text Extraction:** Names, emails, phone numbers

## 🎯 How It Works

The OCR system uses multiple libraries for robust text extraction:

1. **EasyOCR:** Primary OCR engine for text detection
2. **Tesseract:** Backup OCR engine for better accuracy
3. **OpenCV:** Image preprocessing for better results
4. **PDF2Image:** Converts PDFs to images for processing

### Processing Pipeline

1. **File Upload:** Document is uploaded to the backend
2. **Preprocessing:** Image is cleaned and optimized
3. **Text Extraction:** Multiple OCR engines extract text
4. **Information Parsing:** Names, emails, and phones are extracted
5. **Validation:** Extracted data is validated and formatted
6. **Response:** Structured data is returned to the frontend

## 🔍 Debugging

To see detailed OCR processing logs, check the backend console output when uploading documents.

The system will log:
- File processing steps
- Extracted text (first 200 characters)
- Confidence scores
- Any errors or warnings

## 📈 Performance Tips

1. **Image Quality:** Use clear, high-resolution images
2. **Text Contrast:** Ensure good contrast between text and background
3. **File Size:** Smaller files process faster
4. **Text Orientation:** Ensure text is properly oriented

## 🆘 Getting Help

If you're still having issues:

1. Run the test script: `python test_ocr.py`
2. Check the console output for specific error messages
3. Verify Tesseract installation: `tesseract --version`
4. Check Python package versions: `pip list | grep -E "(easyocr|pytesseract|pdf2image|opencv)"`

## 🎉 Success!

Once OCR is working, you can:

1. Start the backend: `python main.py`
2. Upload documents through the Mini CRM frontend
3. See real text extraction from your images and PDFs
4. Create leads automatically from business cards, resumes, etc.

The OCR system will extract names, emails, and phone numbers from your documents and populate the lead creation form automatically! 