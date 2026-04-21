const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    match: [/^ISBN-\d{13}$/, 'ISBN must be in format ISBN-XXXXXXXXXXXXX (13 digits)']
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'At least one author is required']
  }],
  status: {
    type: String,
    enum: {
      values: ['IN', 'OUT'],
      message: 'Status must be either IN or OUT'
    },
    default: 'IN'
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LibraryAttendant',
    default: null
  },
  returnDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
bookSchema.index({ title: 'text', isbn: 'text' });
bookSchema.methods.isOverdue = function() {
  if (this.status === 'OUT' && this.returnDate) {
    return new Date() > this.returnDate;
  }
  return false;
};

module.exports = mongoose.model('Book', bookSchema);
