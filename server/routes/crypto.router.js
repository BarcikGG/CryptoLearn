const Router = require('express');
const router = new Router();

const cryptoController = require('../controller/crypto.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/buy-crypto', cryptoController.buyCrypto);

router.get('/coins/:userId',
    authMiddleware, 
    cryptoController.getCrypto);

router.get('/current-crypto/:userId/:coin',
    authMiddleware, 
    cryptoController.getAvalableCrypto);

module.exports = router