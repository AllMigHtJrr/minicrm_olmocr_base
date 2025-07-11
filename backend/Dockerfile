FROM alleninstituteforai/olmocr:latest

# Patch the GPU memory check to 6GB in all OLM OCR check.py locations
RUN sed -i 's/min_gpu_memory: int = 20 \* 1024\*\*3/min_gpu_memory: int = 6 * 1024**3/' /usr/local/lib/python3.12/dist-packages/olmocr/check.py && \
    sed -i 's/min_gpu_memory: int = 20 \* 1024\*\*3/min_gpu_memory: int = 6 * 1024**3/' /build/olmocr/check.py && \
    sed -i 's/min_gpu_memory: int = 20 \* 1024\*\*3/min_gpu_memory: int = 6 * 1024**3/' /build/build/lib/olmocr/check.py && \
    sed -i 's/min_gpu_memory: int = 20 \* 1024\*\*3/min_gpu_memory: int = 6 * 1024**3/' /usr/local/lib/python3.12/dist-packages/build/lib/olmocr/check.py 