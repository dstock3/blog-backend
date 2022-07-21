import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    username: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, required: true},
    date: {type: Date}
});

//Export model
export default mongoose.model('Comments', CommentSchema);