const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const validate = require('../middleware/validate');
const { authorValidation, idParamValidation } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(authorController.getAllAuthors)
  .post(protect, validate(authorValidation), authorController.createAuthor);

router
  .route('/:id')
  .get(validate(idParamValidation), authorController.getAuthor)
  .put(protect, validate([...idParamValidation, ...authorValidation]), authorController.updateAuthor)
  .delete(protect, validate(idParamValidation), authorController.deleteAuthor);

module.exports = router;
