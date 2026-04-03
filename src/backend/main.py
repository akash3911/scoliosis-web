import dotenv
dotenv.load_dotenv()
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO

import cv2 as cv
import numpy as np
from PIL import Image

# -- 1. Create FastAPI app --
app = FastAPI()

# -- 2. Enable CORS All Origin --
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# -- 3. Load model if not yet loaded --
from scoliotect.yolov8_detector import predict_image_to_api_format

# 4. -- Routes --
@app.get("/")
async def read_root():
    print("Read Root started")
    return {
        "Hello": "World",
        "Message": "Welcome to Scoliotect-API! Send a POST request to get started!",
        "ModelPredictV1": "/v1/getprediction",
    }


async def _upload_to_bgr_image(image: UploadFile):
    pil_img = Image.open(BytesIO(await image.read())).convert('RGB')
    return cv.cvtColor(np.array(pil_img), cv.COLOR_RGB2BGR)

@app.post('/v1/getprediction')
async def get_prediction_v1(image: UploadFile):
    # - Preprocess 'Image'
    image = await _upload_to_bgr_image(image)

    # - YOLOv8 Predict (current v3 behavior)
    api_object = predict_image_to_api_format(image)
    print(api_object)
    return api_object