const Router = require('express');
const router = new Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { body, param } = require('express-validator');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', 
    body('email').isEmail().withMessage('Неверный формат email'), 
    body('username').isLength({min: 2, max: 18}).withMessage('Длина логина должна быть от 2 до 18 символов'),
    userController.registration);
router.post('/login', userController.login);
router.post('/reset', userController.reset)
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.post('/deposit', userController.deposit);
router.post('/user-update', upload.single('image'), userController.update);

router.get('/activation/:link', userController.activate);
router.get('/send-code/:email', param('email').isEmail(), userController.send_code);
router.get('/balance/:userId', 
    authMiddleware,
    userController.getHostoryBalance);
router.get('/user/:userId',
    authMiddleware, 
    userController.getUser);

module.exports = router