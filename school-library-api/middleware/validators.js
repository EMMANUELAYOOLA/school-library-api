const { body, param, query } = require('express-validator');

const authorValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Author name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters')
];

const bookValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Book title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('isbn')
    .trim()
    .notEmpty().withMessage('ISBN is required')
    .matches(/^ISBN-\d{13}$/).withMessage('ISBN must be in format ISBN-XXXXXXXXXXXXX (13 digits)'),
  body('authors')
    .isArray({ min: 1 }).withMessage('At least one author ID is required')
    .custom((value) => {
      return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    }).withMessage('Invalid author ID format'),
  body('status')
    .optional()
    .isIn(['IN', 'OUT']).withMessage('Status must be IN or OUT')
];

const studentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Student name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .toUpperCase()
];

const attendantValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Attendant name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('staffId')
    .trim()
    .notEmpty().withMessage('Staff ID is required')
    .toUpperCase(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const borrowValidation = [
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .isMongoId().withMessage('Invalid student ID format'),
  body('attendantId')
    .trim()
    .notEmpty().withMessage('Attendant ID is required')
    .isMongoId().withMessage('Invalid attendant ID format'),
  body('returnDate')
    .trim()
    .notEmpty().withMessage('Return date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Return date must be in the future');
      }
      return true;
    })
];

const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage('Search query cannot be empty')
];

module.exports = {
  authorValidation,
  bookValidation,
  studentValidation,
  attendantValidation,
  borrowValidation,
  idParamValidation,
  paginationValidation
};
