import 'dotenv/config';
import compression from 'compression';
import helmet from 'helmet';
import routes from './routes/index.js'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/users.js'
import Article from './models/articles.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true});
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
app.use(helmet());
app.use(compression());

app.use('/', routes.articles);
app.use('/', routes.users);


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
