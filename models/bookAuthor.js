module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BookAuthor', {
        book_id: DataTypes.INTEGER,
        author_id: DataTypes.INTEGER,
        role: { 
            type: DataTypes.ENUM('penulis', 'editor', 'penanggung jawab'),
            allowNull: false,
            defaultValue: 'penulis'
        },
    }, {
        timestamps: true
    });
};