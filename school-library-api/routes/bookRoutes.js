const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validate = require('../middleware/validate');
const {
  bookValidation,
  borrowValidation,
  idParamValidation,
  paginationValidation
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(validate(paginationValidation), bookController.getAllBooks)
  .post(protect, validate(bookValidation), bookController.createBook);

router.get('/overdue', protect, bookController.getOverdueBooks);

router
  .route('/:id')
  .get(validate(idParamValidation), bookController.getBook)
  .put(protect, validate([...idParamValidation, ...bookValidation]), bookController.updateBook)
  .delete(protect, validate(idParamValidation), bookController.deleteBook);

router.post(
  '/:id/borrow',
  protect,
  validate([...idParamValidation, ...borrowValidation]),
  bookController.borrowBook
);

router.post(
  '/:id/return',
  protect,
  validate(idParamValidation),
  bookController.returnBook
);

module.exports = router;
