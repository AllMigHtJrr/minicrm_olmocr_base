# Docker OLM OCR Integration

This backend now includes Docker-based OLM OCR integration for robust document processing. The system will automatically use Docker OLM OCR first, with fallback to Python OLM OCR if Docker is not available.

## Features

- **Docker-based OLM OCR**: Uses the official `alleninstituteforai/olmocr:latest` Docker image
- **Automatic fallback**: Falls back to Python OLM OCR if Docker fails
- **GPU acceleration**: Automatically uses GPU if available (RTX 4060 8GB+ supported)
- **Robust processing**: Handles timeouts and errors gracefully
- **Multiple output formats**: Supports JSON and Markdown output parsing

## Prerequisites

### 1. Docker Installation
Install Docker Desktop for Windows:
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Ensure Docker is running (check system tray icon)

### 2. GPU Support (Optional but Recommended)
For GPU acceleration, ensure you have:
- NVIDIA GPU with 6GB+ VRAM (RTX 4060 8GB works well)
- NVIDIA drivers installed
- Docker with GPU support enabled

## Setup

### 1. Pull OLM OCR Docker Image
The system will automatically pull the image on first use, but you can pre-pull it:

```bash
docker pull alleninstituteforai/olmocr:latest
```

### 2. Test the Integration
Run the test script to verify everything works:

```bash
cd backend
python test_docker_integration.py
```

### 3. Start the Backend
The backend will automatically detect Docker availability and use it for document processing:

```bash
cd backend
uvicorn main:app --reload --port 8001
```

## How It Works

### Processing Flow
1. **Document Upload**: User uploads a document (PDF, PNG, JPG)
2. **Docker Check**: System checks if Docker and OLM OCR image are available
3. **Docker Processing**: If available, runs OLM OCR in Docker container
4. **Fallback**: If Docker fails, falls back to Python OLM OCR
5. **Final Fallback**: If both fail, uses simple text extraction
6. **Result**: Returns extracted contact information

### Docker Command
The system runs this Docker command internally:

```bash
docker run --rm --gpus all \
  -v /path/to/uploads:/workspace/inputs \
  -v /path/to/outputs:/workspace/outputs \
  alleninstituteforai/olmocr:latest \
  python olmocr/pipeline.py /workspace/outputs \
  --pdfs /workspace/inputs/filename.png
```

### Output Files
The Docker container generates:
- `filename.json`: Structured JSON with extracted text and layout
- `filename.md`: Markdown version of extracted content

## Configuration

### Docker Settings
You can modify Docker settings in `docker_olmocr.py`:

```python
docker_olmocr = DockerOLMOCR(
    docker_image="alleninstituteforai/olmocr:latest",  # Docker image
    inputs_dir="uploads",                              # Input directory
    outputs_dir="outputs",                             # Output directory
    timeout=300                                        # Timeout in seconds
)
```

### GPU Memory Requirements
The system automatically adjusts for your GPU:
- **6GB+ VRAM**: Full GPU acceleration
- **<6GB VRAM**: CPU processing (slower but works)

## Troubleshooting

### Docker Not Available
```
❌ Docker command not found. Please install Docker.
```
**Solution**: Install Docker Desktop and ensure it's running.

### OLM OCR Image Not Found
```
❌ OLM OCR Docker image not found
```
**Solution**: The system will automatically pull the image, or run:
```bash
docker pull alleninstituteforai/olmocr:latest
```

### GPU Memory Issues
```
❌ Torch was not able to find a GPU with at least 20 GB of RAM
```
**Solution**: The Docker container has been modified to work with 6GB+ VRAM. If you still get this error, the system will fall back to Python OLM OCR.

### Processing Timeout
```
❌ Processing timed out after 300 seconds
```
**Solution**: 
- Check if the image is too large (resize to max 1024x1024)
- Increase timeout in `docker_olmocr.py`
- Try a smaller image file

### Permission Issues
```
❌ Permission denied when accessing Docker
```
**Solution**: Ensure your user has Docker permissions or run Docker Desktop as administrator.

## Performance Tips

### For Best Performance
1. **Use GPU**: Ensure Docker has GPU access enabled
2. **Optimize Images**: Resize images to max 1024x1024 pixels
3. **Convert Format**: Use PNG or JPG instead of large PDFs
4. **Clean Environment**: Ensure sufficient disk space and RAM

### Expected Processing Times
- **GPU (RTX 4060)**: 30-60 seconds per document
- **CPU**: 2-5 minutes per document
- **First Run**: Additional 5-10 minutes for model download

## API Endpoints

The integration works with existing endpoints:

### POST /leads/document
Upload a document for OCR processing:

```bash
curl -X POST "http://localhost:8001/leads/document" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@resume.png"
```

### Response Format
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "confidence": 0.8,
  "source": "docker_olmocr",
  "raw_text": "Extracted text content...",
  "extraction_notes": ["OLM OCR extracted 1500 characters"]
}
```

## Monitoring

### Logs
The system provides detailed logging:
- Docker availability checks
- Processing progress
- Error messages and fallbacks
- Performance metrics

### Health Check
Check system status:
```bash
curl http://localhost:8001/health
```

## Support

If you encounter issues:
1. Check the logs for detailed error messages
2. Run the test script: `python test_docker_integration.py`
3. Verify Docker is running and accessible
4. Ensure sufficient system resources (RAM, disk space)

## Fallback Behavior

The system provides multiple fallback levels:
1. **Docker OLM OCR** (Primary)
2. **Python OLM OCR** (Fallback 1)
3. **Simple Text Extraction** (Fallback 2)

This ensures document processing works even if Docker is not available. 