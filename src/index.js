require('dotenv/config');
const express = require('express');
const cors = require('cors');
const models = require('./models');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const articlesRouter = require('./routes/articles');
const sessionRouter = require('./routes/session');

const app = express();

app.use('/index', indexRouter);
app.use('/articles', articlesRouter);
app.use('/users', userRouter);
app.use('/session', sessionRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);