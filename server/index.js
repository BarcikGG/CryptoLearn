require('dotenv').config();
const express = require("express");
const cors = require('cors');
const path = require('path');
const userRouter = require('./routes/user.routes');
const courseRouter = require('./routes/course.router');

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.listen(PORT, () => console.log(`server started on ${PORT} port`));
