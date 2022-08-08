import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({ 
    profileName: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    date: {type: String}
});

//Export model
export default mongoose.model('Comments', CommentSchema);