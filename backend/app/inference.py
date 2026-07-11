import json
import random
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image

from app.config import get_settings
from app.model import ResNet18CBAM
from app.schemas import EmotionPrediction


DEFAULT_LABELS = ["Angry", "Happy", "Neutral", "Sad"]


class EmotionClassifier:
    def __init__(self):
        self.settings = get_settings()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.labels = self._load_labels()
        self.model = self._load_model()

    def _load_labels(self) -> list[str]:
        labels_path = Path(self.settings.labels_path)
        if labels_path.exists():
            return json.loads(labels_path.read_text(encoding="utf-8"))
        return DEFAULT_LABELS

    def _load_model(self):
        model_path = Path(self.settings.model_path)
        if self.settings.mock_inference or not model_path.exists():
            return None

        model = ResNet18CBAM(num_classes=len(self.labels)).to(self.device)
        state = torch.load(model_path, map_location=self.device)
        model.load_state_dict(state)
        model.eval()
        return model

    def predict(self, image_bytes: bytes) -> EmotionPrediction:
        if self.model is None:
            emotion = random.choice(self.labels)
            return EmotionPrediction(emotion=emotion, confidence=0.62, mode="mock")

        tensor = self._prepare_image(image_bytes)
        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
            confidence, index = torch.max(probabilities, dim=0)

        return EmotionPrediction(
            emotion=self.labels[index.item()],
            confidence=round(float(confidence.item()), 4),
            mode="model",
        )

    def _prepare_image(self, image_bytes: bytes):
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(50, 50),
        )

        if len(faces) > 0:
            x, y, w, h = faces[0]
            gray = gray[y : y + h, x : x + w]

        resized = cv2.resize(gray, (224, 224))
        normalized = resized.astype("float32") / 255.0
        tensor = torch.tensor(normalized, dtype=torch.float32)
        return tensor.unsqueeze(0).unsqueeze(0).to(self.device)


classifier = EmotionClassifier()
