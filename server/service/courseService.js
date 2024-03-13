const User = require('../models/user');
const db = require('../db');
const ApiError = require('../exceptions/apiError');

class CourseService {
    async getCourses(type) {
        if(type == 'all') 
        {
            const Query = 'SELECT * FROM "Course"';
            const Result = await db.query(Query);

            return Result.rows;
        }

        const Query = 'SELECT * FROM "Course" WHERE theme = $1';
        const Result = await db.query(Query, [type]);

        return Result.rows;
    }

    async getCoursesBought(userId) {
        const Query = 'SELECT * FROM "UserBoughtCourses" WHERE userid = $1';
        const Result = await db.query(Query, [userId]);

        const courseIds = Result.rows.map(row => row.courseid);

        return courseIds;
    }

    async buyCourse(courseId, balance, userId, price) {
        await db.query(
            'INSERT INTO "UserBoughtCourses" (userid, courseid) values ($1, $2) RETURNING *',
            [userId, courseId]
        );

        const newBalance = balance - price;

        const updateQuery = 'UPDATE "User" SET balance = $1 WHERE id = $2';
        await db.query(updateQuery, [newBalance, userId]);

        await db.query(
            'INSERT INTO "balance_history" (user_id, amount, description, operation_type) values ($1, $2, $3, $4) RETURNING *',
            [userId, price, "Покупка курса", "debit"]
        );

        return newBalance.toString();
    }

    async addCourse(title, price, about, theme, avatar) {
        const course = await  db.query(
            'INSERT INTO "Course" (price, title, lessonscount, about, theme, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [price, title, 0, about, theme, avatar]
        );

        return course;
    }
}

module.exports = new CourseService();