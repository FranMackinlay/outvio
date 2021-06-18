import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Book from '../models/BooksSchema.js';
import Author from '../models/AuthorSchema.js';
import path from 'path';
import dotenv from 'dotenv';
import { mongoRateLimiter } from '../middlewares/mongoRateLimiter.js';

const __dirname = path.resolve();

dotenv.config({ path: __dirname + '/.env' });

const {
  GET_BOOKS_MAX_REQUEST_COUNT,
  GET_BOOK_BY_ID_MAX_REQUEST_COUNT,
  POST_BOOK_MAX_REQUEST_COUNT,
  UPDATE_BOOK_MAX_REQUEST_COUNT,
  DELETE_BOOK_MAX_REQUEST_COUNT,
  HOUR_LIMIT,
  MONGODB_URL
} = process.env;

const router = express.Router();

/* GET Books */
router.get('/', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, GET_BOOKS_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const books = await Book.find()
  res.send({ books });
}));

/* GET book by _id */
router.get('/:bookId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, GET_BOOK_BY_ID_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const _id = req.params.bookId;

  const book = await Book.findById(_id).populate('author', Author);

  res.send({ book });
}));

/* Post new book */
router.post('/', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, POST_BOOK_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {

  const { book } = req.body;

  try {
    const createdBook = await Book.create(book);

    res.send({ createdBook, success: !!createdBook._id });
  } catch (error) {
    res.send(error.message);
  }

}));

/* PUT update book by _id */
router.put('/:bookId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, UPDATE_BOOK_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { book } = req.body;


  const upsertedBook = await Book.findByIdAndUpdate(bookId, book, { new: true }).populate('author', Author);

  res.send({ upsertedBook, success: !!upsertedBook._id });
}));

/* DELETE book by _id. */
router.delete('/:bookId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, DELETE_BOOK_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const { bookId } = req.params;

  await Book.findOneAndDelete({ _id: bookId });
  res.send({ success: true });
}));



export default router;
