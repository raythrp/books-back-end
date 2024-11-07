  const books = require('../../src/books.js');
const { nanoid } = require('nanoid');

const addBook = (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
  let finishedStatus = false;
  const bookId = nanoid(16);
  const insertedAt = new Date().toISOString();

  // Incomplete request body
  if (name == undefined) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return;
  } else if (readPage > pageCount) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return;
  } else if (readPage == pageCount) {
    finishedStatus = true
  }

  const book = {
    bookId, name, year, author, summary, publisher, pageCount, readPage,
    finished: finishedStatus,
    reading,
    insertedAt: insertedAt,
    updatedAt: insertedAt
  };

  books.push(book);
  const bookInserted = books.find((book) => book.bookId === bookId);

  if (bookInserted) {
    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: book
    });
  }
};

const getAllBooks = (req, res) => {
  let query = req.query;
  let booksData = [];

  if (query.name) {
    booksData = books.filter((book) => book.name.toLowerCase().includes(query.name.toLowerCase()));
  } else if (query.reading) {
    booksData = books.filter((book) => book.reading == query.reading);
  } else if (query.finished) {
    booksData = books.filter((book) => book.finished == query.finished);
  } else {
    booksData = books;
  }

  const filteredBooks = booksData.map((book) => ({
    id: book.bookId,
    name: book.name,
    publisher: book.publisher
  }));

  res.status(200).json({
    status: 'success',
    data: {
      books: filteredBooks
    }
  });
};

const getBookById = (req, res) => {
  const id = req.params.bookid;
  const book = books.filter((book) => book.bookId === id);

  if (book.length === 1) {
    const filteredBook = book.map((entity) => ({
      ...entity,
      id: entity.bookId
    }));
    res.status(200).json({
      status: 'success',
      data: {
        book: filteredBook[0]
      }
    });
    return;
  }

  // Id doesnt exist
  res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
};

const editBookById = (req, res) => {
  const id = req.params.bookid;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
  const updatedAt = new Date().toISOString();
  const targetIndex = books.findIndex((book) => book.bookId === id);

  // Incomplete request body
  if (name == undefined) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return;
  } else if (readPage > pageCount) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return;
  }

  if (targetIndex !== -1) {
    books[targetIndex] = {
      ...books[targetIndex],
      name, year, author, summary, publisher, pageCount, readPage, reading,
      updatedAt: updatedAt
    };

    res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    return;
  }

  // Id doesnt exist
  res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
};

const deleteBookById = (req, res) => {
  const id = req.params.bookid;
  
  const targetIndex = books.findIndex((book) => book.bookId === id);

  if (targetIndex !== -1) {
    books.splice(targetIndex, 1);
    res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    return;
  }

  // Id doesnt exist
  res.status(404).json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
}

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById
}