const Router = require('express');
const router = new Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { body } = require('express-validator');
const userController = require('../controller/user.controller');
const courseController = require('../controller/course.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', 
    body('email').isEmail(), 
    body('username').isLength({min: 1, max: 18}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.post('/buy-course', courseController.buyCourse);
router.post('/deposit', userController.deposit);
router.post('/add-course', courseController.addCourse);
router.post('/user-update', upload.single('image'), userController.update);

router.get('/activation/:link', userController.activate);
router.get('/balance/:userId', 
    authMiddleware,
    userController.getHostoryBalance);
router.get('/user/:userId',
    authMiddleware, 
    userController.getUser);
router.get('/courses/:type',
    authMiddleware, 
    courseController.getCourses);
router.get('/courses-bought/:userId',
    authMiddleware, 
    courseController.getCoursesBought);

module.exports = router