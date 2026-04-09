import mongoose from 'mongoose'; 
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 3 && v.length <= 255;
      },
      message: 'Descrição deve ter entre 3 e 255 caracteres'
    }
  },
  path: {
    type: String,
    trim: true
  },
  likes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual URL
postSchema.virtual('url').get(function() {
  return `${process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://' + process.env.HOST}/${this.path}`;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Static method to populate relations
postSchema.statics.populateRelations = function(query) {
  return this.populate(query, [{
    path: 'author',
    select: 'name nickname'
  }, {
    path: 'comments',
    populate: [{ path: 'author', select: 'name nickname' }, { path: 'post' }]
  }, {
    path: 'likes',
    populate: { path: 'user', select: 'name nickname' }
  }]);
};

export default mongoose.model('Post', postSchema);
