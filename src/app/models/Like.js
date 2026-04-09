import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate likes by same user on same post
likeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

// Static method to populate relations
likeSchema.statics.populateRelations = function(query) {
  return this.populate(query, [{
    path: 'user',
    select: 'name nickname'
  }, {
    path: 'post',
    select: 'description likes_count'
  }]);
};

export default mongoose.model('Like', likeSchema);
