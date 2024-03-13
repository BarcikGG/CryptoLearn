const Router = require('express');
const router = new Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const courseController = require('../controller/course.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/buy-course', courseController.buyCourse);
router.post('/add-course', courseController.addCourse);

router.get('/courses/:type',
    authMiddleware, 
    courseController.getCourses);
router.get('/courses-bought/:userId',
    authMiddleware, 
    courseController.getCoursesBought);

module.exports = router