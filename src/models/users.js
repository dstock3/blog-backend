import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    profileName: {type: String, required: true, minLength: 4, maxLength: 25},
    email: {type: String, required: true},
    password: {type: String, required: true, minLength: 5 },
    admin: {type: Boolean, default: false},
    profileDesc: {type: String, required: true, maxLength: 350},
    profilePic: {type: String, typeKey: '$type' },
    themePref: {type: String, default: "dark"},
    layoutPref: {type: String, default: "basic"},
    blogTitle: {type: String, required: true, maxLength: 100},
    dateJoined: {type: String},
    articles: [{type: Schema.Types.ObjectId, ref: 'Articles'}]
});

// Virtual for User's URL
UserSchema
  .virtual('url')
  .get(function () {
    return '/' + this.username;
});

//Export model
export default mongoose.model('User', UserSchema);