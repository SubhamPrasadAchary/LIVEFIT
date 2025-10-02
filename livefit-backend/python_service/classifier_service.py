from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io

app = FastAPI()

# Use rajistics Indian food model
MODEL_NAME = "rajistics/finetuned-indian-food"
print(f"🔄 Loading model {MODEL_NAME}...")

# Load processor + model
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess
        inputs = processor(images=image, return_tensors="pt")

        # Forward pass
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits

        # Compute probabilities
        probs = torch.nn.functional.softmax(logits, dim=-1)[0]

        # Top prediction
        top_conf, top_idx = torch.max(probs, dim=0)
        label = model.config.id2label[top_idx.item()]
        confidence = round(top_conf.item(), 4)

        print(f"✅ Classified as: {label} ({confidence})")

        return JSONResponse({
            "label": label,
            "confidence": confidence
        })

    except Exception as e:
        print("❌ Classifier error:", str(e))
        return JSONResponse({"error": str(e)}, status_code=500)
