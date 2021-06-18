import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Author from '../models/AuthorSchema.js';
import Book from '../models/BooksSchema.js';


const router = express.Router();

/* GET Books */
router.get('/', expressAsyncHandler(async (req, res) => {
  const authors = await Author.find()
  res.send({ authors });
}));

/* GET author by _id */
router.get('/:authorId', expressAsyncHandler(async (req, res) => {
  const _id = req.params.authorId;

  const author = await Author.findById(_id).lean();

  const books = await Book.find();

  author.books = books.filter(book => book.author.toString() === author._id.toString());

  res.send({ author });
}));

/* Post new book */
router.post('/', expressAsyncHandler(async (req, res) => {

  const { author } = req.body;

  try {
    const createdAuthor = await Author.create(author);

    res.send({ createdAuthor, success: !!createdAuthor._id });
  } catch (error) {
    res.send(error.message);
  }

}));

/* PUT update author by _id */
router.put('/:authorId', expressAsyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const { author } = req.body;


  const upsertedAuthor = await Author.findByIdAndUpdate(authorId, author, { new: true });

  res.send({ upsertedAuthor, success: !!upsertedAuthor._id });
}));

/* DELETE author by _id. */
router.delete('/:authorId', expressAsyncHandler(async (req, res) => {
  const { authorId } = req.params;

  await Author.findOneAndDelete({ _id: authorId });

  res.send({ success: true });
}));



export default router;
