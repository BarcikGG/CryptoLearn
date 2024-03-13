const courseService = require('../service/courseService');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

class CourseController {
    async getCourses(req, res, next) {
        try {
            const type = req.params.type;
            const courses = await courseService.getCourses(type);
            
            return res.json(courses);
        } catch(e) {
            next(e);
        }
    }

    async getCoursesBought(req, res, next) {
        try {
            const userId = req.params.userId;
            const coursesId = await courseService.getCoursesBought(userId);
            
            return res.json(coursesId);
        } catch(e) {
            next(e);
        }
    }

    async buyCourse(req, res, next) {
        try {
            const { userId, courseId, balance, price } = req.body;
            if (!courseId || !balance) return res.status(400).json({ error: 'Missing fields'});

            const newBalance = await courseService.buyCourse(courseId, balance, userId, price);
            return res.json({newBalance});
        } catch(e) {
            next(e);
        }
    }

    async addCourse(req, res, next) {
        try {
            const title = req.body.title;
            const price = Number(req.body.price);
            const about = req.body.about;
            const theme = req.body.theme;

            var imageUrl = req.body.image;

            if(req.file) {
                const uploadedFileName = `${uuid.v4()}-${req.file.originalname}`;
                const uploadPath = path.join('C:\\Users\\danil\\Desktop\\CryptoLearn\\server', 'uploads\\courses', uploadedFileName);
                fs.writeFileSync(uploadPath, req.file.buffer);
                
                imageUrl = `/uploads/courses/${uploadedFileName}`;
            }

            const course = await courseService.addCourse(title, price, about, theme, imageUrl);
            return res.json({course});
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new CourseController();