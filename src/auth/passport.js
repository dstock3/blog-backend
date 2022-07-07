import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from "passport-jwt";
import User from '../models/users.js';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy((username, password, done) =>{
      User.findOne({username: username}, (err, user) => {
        if (err){
          return done(err);
        }
        if(!user){
          return done(null, false, { message: 'Incorrect Username'});
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res){
            return done(null, user)
          } else {
            return done(null, false, { message: 'Incorrect password'});
          };
        })
      })
    })
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.secretkey,
      },
      (jsonWebTokenPayload, done) => {
        return done(null, jsonWebTokenPayload);
      }
    )
);

export default passport
  