import 'dotenv/config';
import routes from './routes'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/users'
import Article from './models/articles'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*
app.use((req, res, next) => {
  req.context = {
      models,
      me: models.users[1],
  };
  next();
});
*/

app.use('/', routes.articles);
app.use('/', routes.users);
app.use('/', routes.session);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
