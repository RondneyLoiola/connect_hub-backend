import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 1 && v.length <= 500;
      },
      message: 'Comentário deve ter entre 1 e 500 caracteres'
    }
  }
}, {
  timestamps: true
});

// Static method to populate relations
commentSchema.statics.populateRelations = function(query) {
  return this.populate(query, [{
    path: 'author',
    select: 'name nickname'
  }, {
    path: 'post',
    populate: { path: 'author', select: 'name nickname' }
  }]);
};

export default mongoose.model('Comment', commentSchema);
