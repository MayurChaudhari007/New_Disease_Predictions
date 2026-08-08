const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

const predictDisease = async (symptoms) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
            symptoms
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Failed to connect to ML Service');
    }
};

const getSymptoms = async () => {
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/symptoms`);
        return response.data.symptoms;
    } catch (error) {
        throw new Error('Failed to fetch symptoms from ML Service');
    }
};

module.exports = {
    predictDisease,
    getSymptoms
};
