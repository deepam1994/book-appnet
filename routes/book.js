const path = require('path');

const express = require('express');

const bookController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', bookController.getIndex);

router.get('/books', bookController.getBooks);

router.get('/books/:bookId', bookController.getBook);

//router.get('/cart', isAuth, bookController.getCart);

//router.post('/cart', isAuth, bookController.postCart);

//router.post('/cart-delete-item', isAuth, bookController.postCartDeleteBook);
//router.post('/cart-delete-item', bookController.postCartDeleteBook);

//router.get('/checkout', isAuth, bookController.getCheckout);

//router.get('/orders', isAuth, bookController.getOrders);

//router.get('/orders/:orderId', isAuth, bookController.getInvoice);

module.exports = router;
