# MediPredict - ML Service (FastAPI)

This microservice is strictly responsible for running the Machine Learning prediction algorithm. It is completely decoupled from the main database and user management system.

## Features
- High-performance asynchronous API using FastAPI
- Memory-efficient loading of `scikit-learn` Support Vector Machine (SVM) models
- Input validation and sanitization using `pydantic`
- Sub-10ms inference response times

## Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Service
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoint
`POST /predict`
Body:
```json
{
  "patientName": "John",
  "age": 30,
  "gender": "Male",
  "symptoms": ["itching", "skin_rash"]
}
```
Returns the predicted disease and lifestyle recommendations.
