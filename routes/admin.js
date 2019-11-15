const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
//router.get('/add-book', isAuth, adminController.getAddBook);
router.get('/add-book', adminController.getAddBook);

// /admin/products => GET
//router.get('/books', isAuth, adminController.getBooks);
router.get('/books', adminController.getBooks);

///admin/add-product => POST
router.post(
  '/add-book',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  //isAuth,
  adminController.postAddBook
);

//router.get('/edit-book/:bookId', isAuth, adminController.getEditBook);
router.get('/edit-book/:bookId',adminController.getEditBook);

router.post(
  '/edit-book',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    //body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  // isAuth,
  adminController.postEditBook
);

//router.delete('/book/:bookId', isAuth, adminController.deleteBook);
router.delete('/book/:bookId', adminController.deleteBook);

module.exports = router;
