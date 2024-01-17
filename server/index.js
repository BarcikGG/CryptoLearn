require('dotenv').config();
const express = require("express");
const cors = require('cors');
const pgp = require("pg-promise")(/*options*/);
const db = pgp("postgres://username:password@host:port/database");

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => console.log(`server started on ${PORT} port`));