const catchAsync = require('../utils/catchAsync');
const authorService = require('../services/authorService');

exports.createAuthor = catchAsync(async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(201).json({
    status: 'success',
    data: { author }
  });
});

exports.getAllAuthors = catchAsync(async (req, res) => {
  const authors = await authorService.getAllAuthors();
  res.status(200).json({
    status: 'success',
    results: authors.length,
    data: { authors }
  });
});

exports.getAuthor = catchAsync(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { author }
  });
});

exports.updateAuthor = catchAsync(async (req, res) => {
  const author = await authorService.updateAuthor(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { author }
  });
});

exports.deleteAuthor = catchAsync(async (req, res) => {
  await authorService.deleteAuthor(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
