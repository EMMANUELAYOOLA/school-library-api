const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const validate = require('../middleware/validate');
const { attendantValidation } = require('../middleware/validators');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/login', attendantController.login);

router
  .route('/')
  .get(protect, attendantController.getAllAttendants)
  .post(validate(attendantValidation), attendantController.createAttendant);

module.exports = router;
