const express = require('express');
const { body } = require('express-validator');
const { createPrediction, getReports, getReport, deleteReport, getSymptoms } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect); // All report routes are protected

router.get('/symptoms', getSymptoms);

router.post(
    '/predict',
    [
        body('patientName', 'Patient name is required').notEmpty(),
        body('age', 'Age must be a valid number').isNumeric(),
        body('gender', 'Gender is required').notEmpty(),
        body('symptoms', 'Symptoms must be an array of strings').isArray({ min: 1 })
    ],
    validate,
    createPrediction
);

router.get('/reports', getReports);
router.get('/reports/:id', getReport);
router.delete('/reports/:id', deleteReport);

module.exports = router;
