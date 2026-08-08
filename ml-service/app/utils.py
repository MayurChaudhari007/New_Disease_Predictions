def normalize_symptom(symptom_name: str) -> str:
    """
    Normalizes a symptom string by trimming spaces, 
    converting to lowercase, and replacing spaces with underscores.
    """
    return symptom_name.strip().lower().replace(" ", "_")

