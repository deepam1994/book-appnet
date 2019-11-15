const mongoose = require('mongoose');

const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

const Book = require('../models/book');

exports.getAddBook = (req, res, next) => {
 res.render('admin/edit-book', {
    pageTitle: 'Add Book',
    path: '/admin/add-book',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-book', {
      pageTitle: 'Add Book',
      path: '/admin/add-book',
      editing: false,
      hasError: true,
      book: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-book', {
      pageTitle: 'Add Book',
      path: '/admin/add-book',
      editing: false,
      hasError: true,
      book: {
        title: title,
       // imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const book = new Book({
    // _id: new mongoose.Types.ObjectId('5d7b4b4d8cae120af4f41faf'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  book
    .save()
    .then(result => {
      console.log('Created Book');
      res.redirect('/admin/books');
    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getEditBook = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then(book => {
     // console.log("edit bookd"+book)
      if (!book) {
        //console.log("edit book1"+book)
        return res.redirect('/');
      }
      //console.log("edit book1111"+book)
      res.render('admin/edit-book', {
        pageTitle: 'Edit book',
        path: '/admin/edit-book',
        editing: editMode,
        book: book,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log("Edit Error"+error)
      return next(error);
    });
};
exports.postEditBook = (req, res, next) => {
  console.log("postEditBook")
  const bookId = req.body.bookId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-book', {
      pageTitle: 'Edit Book',
      path: '/admin/edit-book',
      editing: true,
      hasError: true,
      book: {
        title: updatedTitle,
        //imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: bookId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Book.findById(bookId)
    .then(book => {
      if (book.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      book.title = updatedTitle;
      book.price = updatedPrice;
      book.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(book.imageUrl);
        book.imageUrl = image.path;
      }
      return book.save().then(result => {
        console.log('UPDATED BOOK!');
        res.redirect('/admin/books');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getBooks = (req, res, next) => {
 Book.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(books => {
      res.render('admin/books', {
        books: books,
        pageTitle: 'Admin Books',
        path: '/admin/books'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;
  console.log("Delete book id "+bookId)
  Book.findById(bookId)
    .then(book => {
      console.log("Delete book"+book)
      if (!book) {
        return next(new Error('Book not found.'));
      }
      fileHelper.deleteFile(book.imageUrl);
      return Book.deleteOne({ _id: bookId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED BOOK');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting book failed.' });
    });
};