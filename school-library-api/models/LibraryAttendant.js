const mongoose = require('mongoose');

const attendantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Attendant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['attendant', 'admin'],
    default: 'attendant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
attendantSchema.virtual('issuedBooks', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'issuedBy'
});

module.exports = mongoose.model('LibraryAttendant', attendantSchema);
