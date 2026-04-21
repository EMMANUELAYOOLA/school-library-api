const Student = require('../models/Student');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

class StudentService {
  async createStudent(data) {
    const student = await Student.create(data);
    return student;
  }

  async getAllStudents() {
    const students = await Student.find().sort({ createdAt: -1 });
    return students;
  }

  async getStudentById(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new AppError('Student not found', 404);
    }
    const borrowedBooks = await Book.find({ borrowedBy: id })
      .populate('authors', 'name')
      .populate('issuedBy', 'name staffId');

    return {
      ...student.toObject(),
      borrowedBooks,
      totalBorrowed: borrowedBooks.length
    };
  }
}

module.exports = new StudentService();
