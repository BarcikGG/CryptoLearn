const Router = require('express');
const router = new Router();
const { body } = require('express-validator');
const userController = require('../controller/user.controller')
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', 
    body('email').isEmail(), 
    body('username').isLength({min: 1, max: 18}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);

router.get('/activation/:link', userController.activate);
router.get('/balance/:userId', 
    authMiddleware,
    userController.getHostoryBalance);
router.get('/user/:userId',
    authMiddleware, 
    userController.getUser);
router.get('/courses/:type',
    authMiddleware, 
    userController.getCourses);
router.get('/courses-bought/:userId',
    authMiddleware, 
    userController.getCoursesBought);

module.exports = router