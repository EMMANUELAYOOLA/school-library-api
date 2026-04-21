const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validate = require('../middleware/validate');
const { studentValidation, idParamValidation } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, studentController.getAllStudents)
  .post(protect, validate(studentValidation), studentController.createStudent);

router
  .route('/:id')
  .get(protect, validate(idParamValidation), studentController.getStudent);

module.exports = router;
