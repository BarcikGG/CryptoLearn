require('dotenv').config();
const express = require("express");
const cors = require('cors');
const userRouter = require('./routes/user.routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use('/api', userRouter);
app.listen(PORT, () => console.log(`server started on ${PORT} port`));
