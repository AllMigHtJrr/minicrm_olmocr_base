import re
import logging
import aiofiles
import os
from typing import Dict, Optional, Tuple
from PIL import Image
import io
import cv2
import numpy as np
import base64
import urllib.request
from io import BytesIO

# OLM OCR Libraries
try:
    from transformers import AutoProcessor, Qwen2VLForConditionalGeneration
    import torch
    from pdf2image import convert_from_bytes
    OLM_OCR_AVAILABLE = True
except ImportError as e:
    OLM_OCR_AVAILABLE = False
    logging.warning(f"OLM OCR libraries not available: {e}")
    logging.warning("Install OLM OCR libraries: pip install transformers torch pdf2image opencv-python accelerate")

logger = logging.getLogger(__name__)

# Email validation regex pattern
EMAIL_PATTERN = r'[\w\.-]+@[\w\.-]+\.\w+'

def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    return bool(re.match(EMAIL_PATTERN, email))

def extract_email_from_text(text: str) -> Optional[str]:
    """Extract email from text using regex"""
    match = re.search(EMAIL_PATTERN, text)
    return match.group(0) if match else None

def extract_name_from_text(text: str) -> Optional[str]:
    """Extract potential name from text using NLP patterns"""
    lines = text.split('\n')
    
    # Look for lines that might contain names
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Skip lines that are clearly not names
        if any(skip in line.lower() for skip in ['@', 'http', 'www', 'phone', 'email', 'address', 'company']):
            continue
            
        # Look for patterns that look like names (2-4 words, mostly letters)
        words = line.split()
        if 2 <= len(words) <= 4:
            # Check if most words are alphabetic
            alphabetic_words = sum(1 for word in words if word.replace('.', '').replace('-', '').isalpha())
            if alphabetic_words >= len(words) * 0.8:  # 80% of words should be alphabetic
                # Clean up the name
                name = ' '.join(words).strip()
                if len(name) >= 3:  # Minimum name length
                    return name
    
    return None

def extract_phone_from_text(text: str) -> Optional[str]:
    """Extract phone number from text using regex"""
    # Multiple phone number patterns
    phone_patterns = [
        r'\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}',  # US format
        r'\+?[0-9]{1,4}[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,4}',  # International
        r'\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}',  # Standard US
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None

async def save_uploaded_file(file_content: bytes, filename: str) -> str:
    """Save uploaded file temporarily and return file path"""
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    file_path = os.path.join(upload_dir, filename)
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_content)
    
    return file_path

async def cleanup_temp_file(file_path: str):
    """Clean up temporary uploaded file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up file {file_path}: {e}")

def preprocess_image(image_array: np.ndarray) -> np.ndarray:
    """Preprocess image for better OCR results"""
    # Convert to RGB if needed
    if len(image_array.shape) == 3 and image_array.shape[2] == 3:
        # Already RGB
        processed_img = image_array
    elif len(image_array.shape) == 3 and image_array.shape[2] == 4:
        # RGBA to RGB
        processed_img = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
    elif len(image_array.shape) == 2:
        # Grayscale to RGB
        processed_img = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
    else:
        processed_img = image_array
    
    return processed_img

def resize_image_to_1024(image: Image.Image) -> Image.Image:
    """Resize image so longest dimension is 1024 pixels"""
    width, height = image.size
    if width > height:
        new_width = 1024
        new_height = int(height * 1024 / width)
    else:
        new_height = 1024
        new_width = int(width * 1024 / height)
    
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

def encode_image_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 string"""
    img_buffer = BytesIO()
    image.save(img_buffer, format='PNG')
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    return img_str

def build_simple_prompt() -> str:
    """Build an optimized prompt for fast OLM OCR extraction"""
    return """Extract contact information from this document. Focus only on:
- Name
- Email
- Phone

Format: Name: [name], Email: [email], Phone: [phone]"""

def load_olmocr_model():
    """Load OLM OCR model (singleton pattern) - Optimized for RTX 4060 8GB with CPU fallback"""
    if not hasattr(load_olmocr_model, 'model') or not hasattr(load_olmocr_model, 'processor'):
        logger.info("Loading OLM OCR model: allenai/olmOCR-7B-0225-preview...")
        
        # Try GPU first, fallback to CPU if needed
        use_gpu = False
        device = torch.device("cpu")
        torch_dtype = torch.float32
        device_map = "cpu"
        
        if torch.cuda.is_available():
            try:
                # Check GPU memory
                gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                logger.info(f"GPU detected: {torch.cuda.get_device_name()}")
                logger.info(f"GPU memory: {gpu_memory:.1f} GB")
                
                if gpu_memory >= 6:  # Need at least 6GB for the model
                    use_gpu = True
                    device = torch.device("cuda")
                    torch_dtype = torch.float16  # Use half precision to save memory
                    device_map = "auto"  # Let the model decide optimal mapping
                    logger.info("✅ Using GPU acceleration with optimized settings")
                else:
                    logger.warning(f"⚠️ GPU memory ({gpu_memory:.1f}GB) may be insufficient, using CPU")
                    
            except Exception as e:
                logger.warning(f"⚠️ GPU setup failed: {e}, falling back to CPU")
        
        if not use_gpu:
            logger.info("🖥️ Using CPU mode (slower but more reliable)")
        
        try:
            # Load model with optimal settings
            model = Qwen2VLForConditionalGeneration.from_pretrained(
                "allenai/olmOCR-7B-0225-preview", 
                torch_dtype=torch_dtype,
                device_map=device_map,
                low_cpu_mem_usage=True,
                attn_implementation="eager"  # Use eager attention (works without flash_attn)
            ).eval()
            
            # Use the Qwen2-VL-7B-Instruct processor
            processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-7B-Instruct")
            
            # Move to device if not already mapped
            if device_map == "cpu":
                model.to(device)
            
            load_olmocr_model.model = model
            load_olmocr_model.processor = processor
            load_olmocr_model.device = device
            load_olmocr_model.use_gpu = use_gpu
            
            logger.info("✅ OLM OCR model loaded successfully")
            logger.info(f"📍 Device: {device}")
            logger.info(f"⚡ GPU Mode: {use_gpu}")
            
        except Exception as e:
            logger.error(f"❌ Failed to load OLM OCR model: {e}")
            raise
            
    return load_olmocr_model.model, load_olmocr_model.processor, load_olmocr_model.device

def olmocr_extraction(file_content: bytes, filename: str) -> Dict[str, str]:
    """
    Optimized OLM OCR extraction with GPU acceleration and memory monitoring
    """
    if not OLM_OCR_AVAILABLE:
        logger.error("OLM OCR libraries not available")
        return {
            "name": "OLM OCR Not Available",
            "email": "ocr@not.available",
            "error": "OLM OCR libraries not installed"
        }
    
    logger.info(f"🚀 Processing file with OLM OCR: {filename}")
    
    try:
        # Load model, processor, and device
        model, processor, device = load_olmocr_model()
        
        # Monitor GPU memory if using GPU
        if hasattr(load_olmocr_model, 'use_gpu') and load_olmocr_model.use_gpu:
            try:
                gpu_memory_used = torch.cuda.memory_allocated() / (1024**3)
                gpu_memory_total = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                logger.info(f"📊 GPU Memory: {gpu_memory_used:.1f}GB / {gpu_memory_total:.1f}GB")
            except:
                pass
        
        # Process based on file type
        if filename.lower().endswith('.pdf'):
            # Convert PDF to images
            images = convert_from_bytes(file_content)
            all_text = ""
            
            for i, image in enumerate(images):
                logger.info(f"Processing PDF page {i+1}/{len(images)}")
                
                # Resize image to 1024px longest dimension
                resized_image = resize_image_to_1024(image)
                
                # Encode image to base64
                image_base64 = encode_image_to_base64(resized_image)
                
                # Build prompt
                prompt = build_simple_prompt()
                
                # Build messages in the format expected by Qwen2-VL
                messages = [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}},
                        ],
                    }
                ]
                
                # Apply chat template and processor
                text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
                
                # Process with the model
                inputs = processor(
                    text=[text],
                    images=[resized_image],
                    padding=True,
                    return_tensors="pt",
                )
                inputs = {key: value.to(device) for (key, value) in inputs.items()}
                
                # Generate output with maximum speed optimization
                with torch.no_grad():
                    output = model.generate(
                        **inputs,
                        temperature=0.1,  # Very low temperature for fastest generation
                        max_new_tokens=128,  # Minimal tokens for speed
                        num_return_sequences=1,
                        do_sample=False,  # Deterministic generation
                        pad_token_id=processor.tokenizer.eos_token_id,
                        use_cache=True,  # Enable KV cache for speed
                        repetition_penalty=1.0,  # No repetition penalty for speed
                    )
                
                # Decode output
                prompt_length = inputs["input_ids"].shape[1]
                new_tokens = output[:, prompt_length:]
                generated_text = processor.tokenizer.batch_decode(
                    new_tokens, skip_special_tokens=True
                )[0]
                
                all_text += f"Page {i+1}: {generated_text}\n"
        
        else:
            # Process image file (PNG, JPG, etc.)
            # Convert bytes to PIL Image
            image = Image.open(BytesIO(file_content))
            
            # Resize image to 1024px longest dimension
            resized_image = resize_image_to_1024(image)
            
            # Encode image to base64
            image_base64 = encode_image_to_base64(resized_image)
            
            # Build prompt
            prompt = build_simple_prompt()
            
            # Build messages in the format expected by Qwen2-VL
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}},
                    ],
                }
            ]
            
            # Apply chat template and processor
            text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            
            # Process with the model
            inputs = processor(
                text=[text],
                images=[resized_image],
                padding=True,
                return_tensors="pt",
            )
            inputs = {key: value.to(device) for (key, value) in inputs.items()}
            
            # Generate output with maximum speed optimization
            with torch.no_grad():
                output = model.generate(
                    **inputs,
                    temperature=0.1,  # Very low temperature for fastest generation
                    max_new_tokens=128,  # Minimal tokens for speed
                    num_return_sequences=1,
                    do_sample=False,  # Deterministic generation
                    pad_token_id=processor.tokenizer.eos_token_id,
                    use_cache=True,  # Enable KV cache for speed
                    repetition_penalty=1.0,  # No repetition penalty for speed
                )
            
            # Decode output
            prompt_length = inputs["input_ids"].shape[1]
            new_tokens = output[:, prompt_length:]
            all_text = processor.tokenizer.batch_decode(
                new_tokens, skip_special_tokens=True
            )[0]
        
        logger.info(f"✅ OLM OCR extracted text: {all_text[:100]}...")  # Log first 100 chars
        
        # Extract information from text
        extracted_email = extract_email_from_text(all_text)
        extracted_name = extract_name_from_text(all_text)
        extracted_phone = extract_phone_from_text(all_text)
        
        # Validate and provide fallbacks
        if not extracted_email:
            extracted_email = "email@not.found"
            logger.warning("No email found in document")
        
        if not extracted_name:
            extracted_name = "Name Not Found"
            logger.warning("No name found in document")
        
        if not extracted_phone:
            extracted_phone = "Phone Not Found"
            logger.warning("No phone found in document")
        
        return {
            "name": extracted_name,
            "email": extracted_email,
            "phone": extracted_phone,
            "raw_text": all_text[:500]  # Store first 500 chars for debugging
        }
        
    except Exception as e:
        logger.error(f"OLM OCR processing failed: {str(e)}")
        return {
            "name": "OLM OCR Error",
            "email": "error@ocr.failed",
            "phone": "Error",
            "error": str(e)
        }

def mock_olmocr_extraction(file_content: bytes, filename: str) -> Dict[str, str]:
    """
    Real OLM OCR extraction - renamed for compatibility
    """
    return olmocr_extraction(file_content, filename)

def validate_workflow_structure(nodes: list, edges: list) -> Tuple[bool, str]:
    """
    Validate workflow structure
    - Ensure Lead Created is always the trigger
    - Allow only up to 3 action nodes
    - Validate connected nodes
    """
    if not nodes:
        return False, "No nodes provided"
    
    # Check for trigger node
    trigger_nodes = [node for node in nodes if node.get('type') == 'trigger']
    if not trigger_nodes:
        return False, "No trigger node found"
    
    # Check if Lead Created is the trigger
    lead_created_trigger = any(
        node.get('type') == 'trigger' and 
        node.get('data', {}).get('label') == 'Lead Created'
        for node in nodes
    )
    if not lead_created_trigger:
        return False, "Lead Created trigger is required"
    
    # Count action nodes
    action_nodes = [node for node in nodes if node.get('type') == 'action']
    if len(action_nodes) > 3:
        return False, "Maximum 3 action nodes allowed"
    
    # Validate connected nodes
    node_ids = {node['id'] for node in nodes}
    for edge in edges:
        if edge.get('source') not in node_ids or edge.get('target') not in node_ids:
            return False, f"Edge references non-existent node: {edge.get('source')} -> {edge.get('target')}"
    
    return True, "Workflow structure is valid"

def get_workflow_action_description(node_data: dict) -> str:
    """Get human-readable description of workflow action"""
    label = node_data.get('label', 'Unknown')
    
    if 'email' in label.lower():
        return f"Email triggered: {label}"
    elif 'status' in label.lower():
        return f"Status changed to: {label}"
    elif 'sms' in label.lower():
        return f"SMS triggered: {label}"
    elif 'wait' in label.lower():
        return f"Wait action: {label}"
    else:
        return f"Action executed: {label}"

def sanitize_text(text: str) -> str:
    """Sanitize text input by trimming whitespace and normalizing"""
    return text.strip() if text else ""

def generate_unique_id() -> int:
    """Generate unique ID for leads"""
    import time
    return int(time.time() * 1000) 