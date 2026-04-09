import Sequelize, { Model } from 'sequelize';

class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        post_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Comentário não pode ser vazio',
            },
            len: {
              args: [1, 500],
              msg: 'Comentário deve ter entre 1 e 500 caracteres',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'comments',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  }
}

export default Comment;
