import 'dotenv/config';
import models from './models';
import routes from './routes';
import express from 'express';
import cors from 'cors';

const app = express();

app.use('/articles', routes.articles);
app.use('/users', routes.user);
app.use('/session', routes.session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  req.context = {
      models,
      me: models.users[1],
  };
  next();
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
