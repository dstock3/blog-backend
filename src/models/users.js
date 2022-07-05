import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    profileName: {type: String, required: true, minLength: 5, maxLength: 100},
    admin: {type: Boolean, default: false},
    profileDesc: {type: String, required: true, maxLength: 350},
    profilePic: {type: String},
    themePref: {type: String, required: true, default: "dark"},
    layoutPref: {type: String, required: true, default: "basic"},
    blogTitle: {type: String, required: true, maxLength: 100},
    dateJoined: {type: Date},
    articles: [{type: Schema.Types.ObjectId, ref: 'Articles'}]
  }
);

// Virtual for User's URL
UserSchema
.virtual('url')
.get(function () {
  return '/' + this.username;
});

//Export model
export default mongoose.model('User', UserSchema);