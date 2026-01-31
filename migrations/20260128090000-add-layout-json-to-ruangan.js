'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ruangan', 'layout_json', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Room layout designer data (grid items)',
      after: 'nama_ruangan',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ruangan', 'layout_json');
  },
};

