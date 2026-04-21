const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'authors'
});
authorSchema.pre('remove', async function(next) {
  await this.model('Book').updateMany(
    { authors: this._id },
    { $pull: { authors: this._id } }
  );
  next();
});

module.exports = mongoose.model('Author', authorSchema);
