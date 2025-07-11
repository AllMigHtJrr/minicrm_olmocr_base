from PIL import Image

img = Image.open("Senior-Test-Engineer-Resume-Example.png").convert("RGB")
img.thumbnail((1024, 1024))
img.save("resume_optimized.png", dpi=(96, 96))