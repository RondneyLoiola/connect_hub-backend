import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        nickname: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'users',
      },
    );

    return this; 
  }

  static associate(models) {
    this.hasMany(models.Post, { 
      foreignKey: 'user_id',
      as: 'posts', 
    });

    this.hasMany(models.Comment, {
      foreignKey: 'user_id',
      as: 'comments',
    });
  }
}

export default User;
