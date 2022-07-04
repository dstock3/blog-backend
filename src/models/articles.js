import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {type: String, required: true, maxLength: 150},
    img: {type: String},
    imgDesc: {type: String, maxLength: 150},
    date: {type: Date, required: true},
    content: {type: String, required: true}
  }
);

// Virtual for User's URL
ArticleSchema
.virtual('url')
.get(function () {
  return '/:username/' + this.articleId;
});

//Export model
export default mongoose.model('Articles', ArticleSchema);