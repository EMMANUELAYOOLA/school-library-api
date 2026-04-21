const catchAsync = require('../utils/catchAsync');
const bookService = require('../services/bookService');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

exports.createBook = catchAsync(async (req, res) => {
  const book = await Book.create(req.body);

  const populatedBook = await Book.findById(book._id)
    .populate('authors', 'name');

  res.status(201).json({
    status: 'success',
    data: { book: populatedBook }
  });
});

exports.getAllBooks = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || '';

  const result = await bookService.searchBooks(search, page, limit);

  res.status(200).json({
    status: 'success',
    results: result.books.length,
    pagination: result.pagination,
    data: { books: result.books }
  });
});

exports.getBook = catchAsync(async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('authors', 'name bio')
    .populate('borrowedBy', 'name email studentId')
    .populate('issuedBy', 'name staffId');

  if (!book) {
    throw new AppError('Book not found', 404);
  }
  const response = {
    ...book.toObject(),
    isOverdue: book.isOverdue()
  };

  res.status(200).json({
    status: 'success',
    data: { book: response }
  });
});

exports.updateBook = catchAsync(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('authors', 'name');

  if (!book) {
    throw new AppError('Book not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { book }
  });
});

exports.deleteBook = catchAsync(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    throw new AppError('Book not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.borrowBook = catchAsync(async (req, res) => {
  const { studentId, attendantId, returnDate } = req.body;
  const book = await bookService.borrowBook(
    req.params.id,
    studentId,
    attendantId,
    returnDate
  );

  const populatedBook = await Book.findById(book._id)
    .populate('authors', 'name')
    .populate('borrowedBy', 'name email studentId')
    .populate('issuedBy', 'name staffId');

  res.status(200).json({
    status: 'success',
    message: 'Book borrowed successfully',
    data: { book: populatedBook }
  });
});

exports.returnBook = catchAsync(async (req, res) => {
  const book = await bookService.returnBook(req.params.id);

  const populatedBook = await Book.findById(book._id)
    .populate('authors', 'name');

  res.status(200).json({
    status: 'success',
    message: 'Book returned successfully',
    data: { book: populatedBook }
  });
});

exports.getOverdueBooks = catchAsync(async (req, res) => {
  const books = await bookService.getOverdueBooks();
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: { books }
  });
});
