const Book = require('../models/Book');
const Student = require('../models/Student');
const LibraryAttendant = require('../models/LibraryAttendant');
const AppError = require('../utils/AppError');

class BookService {
  async borrowBook(bookId, studentId, attendantId, returnDate) {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    if (book.status === 'OUT') {
      throw new AppError('Book is already borrowed', 400);
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    const attendant = await LibraryAttendant.findById(attendantId);
    if (!attendant) {
      throw new AppError('Library attendant not found', 404);
    }

    book.status = 'OUT';
    book.borrowedBy = studentId;
    book.issuedBy = attendantId;
    book.returnDate = new Date(returnDate);

    await book.save();
    return book;
  }
  async returnBook(bookId) {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    if (book.status === 'IN') {
      throw new AppError('Book is already in the library', 400);
    }

    book.status = 'IN';
    book.borrowedBy = null;
    book.issuedBy = null;
    book.returnDate = null;

    await book.save();
    return book;
  }
  async getOverdueBooks() {
    const currentDate = new Date();
    const books = await Book.find({
      status: 'OUT',
      returnDate: { $lt: currentDate }
    }).populate('authors', 'name')
      .populate('borrowedBy', 'name email studentId')
      .populate('issuedBy', 'name staffId');

    return books;
  }
  async searchBooks(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (query) {
      searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { isbn: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const [books, total] = await Promise.all([
      Book.find(searchQuery)
        .populate('authors', 'name')
        .populate('borrowedBy', 'name email studentId')
        .populate('issuedBy', 'name staffId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Book.countDocuments(searchQuery)
    ]);

    return {
      books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        limit
      }
    };
  }
}

module.exports = new BookService();
