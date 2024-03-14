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

    async getLessons(id) {
        const Query = 'SELECT * FROM "CourseCourseItemRelation" WHERE courseid = $1';
        const Result = await db.query(Query, [id]);

        if(Result.rows.length == 0) return;
        
        const courseItemIds = (Result.rows.map(row => row.courseitemid));
        const conditions = courseItemIds.map(id => `id = ${id}`);
        const conditionsString = conditions.join(' OR ');

        const QueryLessons = `SELECT * FROM "CourseItem" WHERE ${conditionsString}`;
        const Lessons = await db.query(QueryLessons);

        return Lessons.rows;
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
        const course = await db.query(
            'INSERT INTO "Course" (price, title, lessonscount, about, theme, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [price, title, 0, about, theme, avatar]
        );

        return course.rows[0];
    }

    async addLesson(courseID, title, about, avatar) {
        const lesson = await db.query(
            'INSERT INTO "CourseItem" (image, description, title) VALUES ($1, $2, $3) RETURNING *',
            [avatar, about, title]
        );

        const lessonID = lesson.rows[0].id;

        await db.query(
            'INSERT INTO "CourseCourseItemRelation" (courseid, courseitemid) VALUES ($1, $2) RETURNING *',
            [courseID, lessonID]
        );

        await db.query(
            'UPDATE "Course" SET lessonscount=lessonscount+1 WHERE id=$1',
            [courseID]
        );

        return lesson.rows[0];
    }
}

module.exports = new CourseService();