from pydantic import BaseModel
from typing import List

class PredictionRequest(BaseModel):
    symptoms: List[str]

class PredictionResponse(BaseModel):
    disease: str
    description: str
    precautions: List[str]
    medications: List[str]
    diets: List[str]
    workouts: List[str]
