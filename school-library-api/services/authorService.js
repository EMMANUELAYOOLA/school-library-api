const Author = require('../models/Author');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

class AuthorService {
  async createAuthor(data) {
    const author = await Author.create(data);
    return author;
  }

  async getAllAuthors() {
    const authors = await Author.find().sort({ createdAt: -1 });
    return authors;
  }

  async getAuthorById(id) {
    const author = await Author.findById(id);
    if (!author) {
      throw new AppError('Author not found', 404);
    }
    return author;
  }

  async updateAuthor(id, data) {
    const author = await Author.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!author) {
      throw new AppError('Author not found', 404);
    }
    return author;
  }

  async deleteAuthor(id) {
    const author = await Author.findById(id);
    if (!author) {
      throw new AppError('Author not found', 404);
    }
    await Book.updateMany(
      { authors: id },
      { $pull: { authors: id } }
    );

    await Author.findByIdAndDelete(id);
    return { message: 'Author deleted successfully' };
  }
}

module.exports = new AuthorService();
