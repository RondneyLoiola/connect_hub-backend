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
    // Agora este campo vai armazenar a URL completa do Cloudinary
    // Exemplo: https://res.cloudinary.com/seu_cloud/image/upload/v123/connect_hub/foto.jpg
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

// ✅ REMOVIDO O VIRTUAL - não é mais necessário
// O campo 'path' já é a URL completa

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