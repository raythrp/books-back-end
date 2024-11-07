const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, editBookById, deleteBookById } = require('../controller/books.js')

router.post('/', addBook);
router.get('/', getAllBooks);
router.get('/:bookid', getBookById);
router.put('/:bookid', editBookById);
router.delete('/:bookid', deleteBookById);

module.exports = router;