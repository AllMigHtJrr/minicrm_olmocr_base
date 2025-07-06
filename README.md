# Mini CRM Dashboard with OLM OCR Integration

A modern, full-stack CRM application with AI-powered document processing using OLM OCR (Optical Character Recognition) for automated lead extraction.

## 🚀 Features

### Core CRM Features
- **Lead Management**: Create, view, update, and delete leads
- **Document Processing**: Upload PDFs and images for automatic lead extraction
- **Interactive Dashboard**: Real-time lead statistics and management
- **Workflow Builder**: Visual workflow automation with React Flow
- **Lead Interactions**: AI-powered lead interaction system

### AI-Powered OCR
- **OLM OCR Integration**: Uses `allenai/olmOCR-7B-0225-preview` model
- **GPU Acceleration**: Optimized for NVIDIA GPUs (RTX 4060+ recommended)
- **Multi-format Support**: PDF, PNG, JPG, JPEG
- **Automatic Fallback**: CPU mode if GPU unavailable
- **Fast Processing**: Optimized for speed with memory management

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Flow** for workflow builder

### Backend
- **FastAPI** (Python 3.11+)
- **PyTorch** with CUDA support
- **Transformers** (Hugging Face)
- **OLM OCR** for document processing
- **Uvicorn** ASGI server

## 📋 Prerequisites

### System Requirements
- **Python 3.11+**
- **Node.js 16+**
- **NVIDIA GPU** (recommended: RTX 4060+ with 8GB+ VRAM)
- **RAM**: 16GB+ (32GB+ recommended)
- **Storage**: 20GB+ free space

### GPU Requirements (Optional but Recommended)
- **CUDA 12.1+** installed
- **Latest NVIDIA drivers**
- **8GB+ GPU memory** for optimal performance

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mini_crm_dashboard-main
```

### 2. Backend Setup

#### Create Python Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

#### Install Dependencies
```bash
pip install -r requirements.txt
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers==4.47.1 pdf2image opencv-python accelerate
```

#### Test OLM OCR Setup
```bash
python test_optimized_ocr.py
```

#### Start Backend Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ..
npm install
```

#### Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000 (or port shown in terminal)
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## 📁 Project Structure

```
mini_crm_dashboard-main/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── utils.py            # OLM OCR utilities and functions
│   ├── models.py           # Pydantic models
│   ├── requirements.txt    # Python dependencies
│   ├── test_optimized_ocr.py  # OCR performance test
│   └── uploads/            # Temporary file storage
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── styles/            # CSS and styling
├── public/                # Static assets
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
# Optional: Customize these settings
MODEL_CACHE_DIR=./models
UPLOAD_MAX_SIZE=10485760  # 10MB
```

### GPU Configuration
The application automatically detects and uses GPU acceleration. If you encounter issues:

1. **Check CUDA installation**:
   ```bash
   python -c "import torch; print('CUDA available:', torch.cuda.is_available())"
   ```

2. **Monitor GPU memory**:
   ```bash
   python -c "import torch; print('GPU memory:', torch.cuda.get_device_properties(0).total_memory/1024**3, 'GB')"
   ```

## 📊 Performance

### Expected Processing Times
- **Model Loading** (first run): 15-30 seconds
- **Document Processing**:
  - Small images (<1MB): 1-5 seconds
  - Medium images (1-5MB): 5-15 seconds
  - Large images (5-10MB): 15-30 seconds
  - Multi-page PDFs: 10-60 seconds per page

### Optimization Tips
- Use images under 2048x2048 pixels for best performance
- Ensure adequate GPU memory (8GB+ recommended)
- Close other GPU-intensive applications during processing

## 🧪 Testing

### Test OLM OCR Performance
```bash
cd backend
python test_optimized_ocr.py
```

### Test Backend API
```bash
# Health check
curl http://localhost:8001/health

# Get leads
curl http://localhost:8001/leads
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CUDA Not Available
```bash
# Install CUDA version of PyTorch
pip uninstall torch torchvision torchaudio -y
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### 2. Out of Memory Errors
- Reduce image size before upload
- Close other applications using GPU
- The system will automatically fall back to CPU mode

#### 3. Slow Processing
- Check GPU memory usage
- Ensure CUDA is properly installed
- Try with smaller images first

#### 4. Model Download Issues
- Check internet connection
- The model (~14GB) will be downloaded on first use
- Ensure adequate disk space

### Performance Monitoring
The application logs GPU memory usage and processing times. Check the backend console for detailed information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OLM OCR**: Allen AI for the powerful OCR model
- **Hugging Face**: Transformers library
- **FastAPI**: Modern Python web framework
- **React**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the backend logs
3. Test with the provided test scripts
4. Create an issue in the repository

---

**Happy CRM-ing! 🎉**