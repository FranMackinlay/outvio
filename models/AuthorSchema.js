import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    required: true,
  },
  last_name: {
    type: String,
    trim: true,
    required: true,
  }
}, {
  timestamps: true,
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
