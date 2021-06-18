import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  }
}, {
  timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
