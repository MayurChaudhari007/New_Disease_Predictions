import time
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.loader import load_data_and_model, symptoms_dict
from app.predictor import get_predicted_disease, get_disease_details
from app.schemas import PredictionRequest, PredictionResponse
from app.utils import normalize_symptom
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML model and datasets into memory once
    load_data_and_model()
    yield
    # Shutdown logic (if any)

app = FastAPI(title="Disease Prediction ML Service", lifespan=lifespan)

# Add CORS for Node.js proxy or direct internal access if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictionResponse)
async def predict_disease(request: PredictionRequest, http_request: Request):
    start_time = time.time()
    
    try:
        raw_symptoms = request.symptoms
        
        # Empty Symptoms Validation
        if not raw_symptoms:
            return JSONResponse(status_code=400, content={"error": "Please provide at least two symptoms."})
            
        # Normalize Input
        normalized_symptoms = [normalize_symptom(s) for s in raw_symptoms]
        
        # Remove Duplicate Symptoms (preserves order just in case)
        unique_symptoms = []
        for s in normalized_symptoms:
            if s not in unique_symptoms:
                unique_symptoms.append(s)
        
        # Minimum Symptoms Validation
        if len(unique_symptoms) < 2:
            return JSONResponse(status_code=400, content={"error": "Please select at least two symptoms."})
            
        # Validate Symptoms against symptoms_dict
        invalid_symptoms = [s for s in unique_symptoms if s not in symptoms_dict]
        if invalid_symptoms:
            if len(invalid_symptoms) == 1:
                error_msg = f"Invalid symptom: {invalid_symptoms[0]}"
            else:
                error_msg = f"Invalid symptoms: {', '.join(invalid_symptoms)}"
            return JSONResponse(status_code=400, content={"error": error_msg})
            
        # Predict the disease based on valid unique symptoms
        disease_name = get_predicted_disease(unique_symptoms)
        
        # Get related details
        details = get_disease_details(disease_name)
        
        # Console Logging
        process_time_ms = int((time.time() - start_time) * 1000)
        # client IP is available via http_request.client.host
        client_ip = http_request.client.host if http_request.client else "Unknown"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        print(f"[{timestamp}]")
        print("Prediction Request")
        print(f"Symptoms: {len(unique_symptoms)}")
        print(f"Disease: {disease_name}")
        print(f"Processing Time: {process_time_ms} ms")
        print("-" * 50)
        
        return PredictionResponse(
            disease=disease_name,
            description=details.get("description", ""),
            precautions=details.get("precautions", []),
            medications=details.get("medications", []),
            diets=details.get("diets", []),
            workouts=details.get("workouts", [])
        )
    except Exception as e:
        # Error Handling (Return 500 without exposing internals)
        return JSONResponse(status_code=500, content={"error": "Internal server error."})

@app.get("/symptoms")
def get_symptoms():
    return {"symptoms": list(symptoms_dict.keys())}

@app.get("/health")
def health_check():
    return {"status": "ok"}
