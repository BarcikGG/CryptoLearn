const courseService = require('../service/courseService');

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
            const { title, price, about, theme, avatar } = req.body;

            const course = await courseService.addCourse(title, price, about, theme, avatar);
            return res.json(course);
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new CourseController();