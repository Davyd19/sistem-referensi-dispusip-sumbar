'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookAuthors', {
      book_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      author_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'Authors',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      role: { 
        type: DataTypes.ENUM('penulis', 'editor', 'penanggung jawab'),
        allowNull: false,
        defaultValue: 'penulis'
      },
      createdAt: { 
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: { 
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BookAuthors');
  }
};