const Report = require('../models/Report');
const { predictDisease, getSymptoms: getSymptomsService } = require('../services/ml.service');

// @desc    Create prediction report
// @route   POST /api/predict
// @access  Private
const createPrediction = async (req, res, next) => {
    try {
        const { patientName, age, gender, symptoms } = req.body;

        // Call FastAPI service
        const mlResponse = await predictDisease(symptoms);

        // Save report to MongoDB
        const report = await Report.create({
            user: req.user.id,
            patientName,
            age,
            gender,
            symptoms,
            predictedDisease: mlResponse.disease,
            description: mlResponse.description,
            precautions: mlResponse.precautions,
            medications: mlResponse.medications,
            diets: mlResponse.diets,
            workouts: mlResponse.workouts
        });

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        // Pass to error handler, if it's ML service error we want to send 400
        if (error.message.includes('ML Service') || error.message.includes('symptom')) {
            res.status(400);
        }
        next(error);
    }
};

// @desc    Get all reports for logged in user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort('-createdAt');
        
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReport = async (req, res, next) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user.id });

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user.id });

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        await report.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Private
const getSymptoms = async (req, res, next) => {
    try {
        const symptoms = await getSymptomsService();
        res.status(200).json({
            success: true,
            data: symptoms
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPrediction,
    getReports,
    getReport,
    deleteReport,
    getSymptoms
};
