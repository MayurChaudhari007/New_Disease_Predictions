import numpy as np
from app.loader import symptoms_dict, diseases_list, disease_details
import app.loader as loader

def get_predicted_disease(patient_symptoms):
    if loader.svc is None:
        raise ValueError("Model is not loaded.")
    
    input_vector = np.zeros(len(symptoms_dict))
    for item in patient_symptoms:
        if item in symptoms_dict:
            input_vector[symptoms_dict[item]] = 1
            
    prediction_idx = loader.svc.predict([input_vector])[0]
    return diseases_list.get(prediction_idx, "Unknown disease")

def get_disease_details(disease_name):
    return disease_details.get(disease_name, {
        'description': 'Details not found.', 
        'precautions': [], 
        'workouts': [], 
        'medications': [], 
        'diets': []
    })
