import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { mongoRateLimiter } from '../middlewares/mongoRateLimiter.js';
import Author from '../models/AuthorSchema.js';
import Book from '../models/BooksSchema.js';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = path.resolve();

dotenv.config({ path: __dirname + '/.env' });

const {
  GET_AUTHORS_MAX_REQUEST_COUNT,
  GET_AUTHOR_BY_ID_MAX_REQUEST_COUNT,
  POST_AUTHOR_MAX_REQUEST_COUNT,
  UPDATE_AUTHOR_MAX_REQUEST_COUNT,
  DELETE_AUTHOR_MAX_REQUEST_COUNT,
  HOUR_LIMIT,
  MONGODB_URL
} = process.env;

const router = express.Router();

/* GET Books */
router.get('/', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, GET_AUTHORS_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const authors = await Author.find()
  res.send({ authors });
}));

/* GET author by _id */
router.get('/:authorId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, GET_AUTHOR_BY_ID_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const _id = req.params.authorId;

  const author = await Author.findById(_id).lean();

  const books = await Book.find();

  author.books = books.filter(book => book.author.toString() === author._id.toString());

  res.send({ author });
}));

/* Post new author */
router.post('/', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, POST_AUTHOR_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {

  const { author } = req.body;

  try {
    const createdAuthor = await Author.create(author);

    res.send({ createdAuthor, success: !!createdAuthor._id });
  } catch (error) {
    res.send(error.message);
  }

}));

/* PUT update author by _id */
router.put('/:authorId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, UPDATE_AUTHOR_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const { author } = req.body;


  const upsertedAuthor = await Author.findByIdAndUpdate(authorId, author, { new: true });

  res.send({ upsertedAuthor, success: !!upsertedAuthor._id });
}));

/* DELETE author by _id. */
router.delete('/:authorId', mongoRateLimiter(MONGODB_URL, HOUR_LIMIT, DELETE_AUTHOR_MAX_REQUEST_COUNT), expressAsyncHandler(async (req, res) => {
  const { authorId } = req.params;

  await Author.findOneAndDelete({ _id: authorId });

  res.send({ success: true });
}));



export default router;
