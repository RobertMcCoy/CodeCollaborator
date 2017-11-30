module.exports = function (sequelize, Sequelize) {
    var Collab = sequelize.define('Collabs', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        collabId: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        savedCollab: {
            type: Sequelize.TEXT
        }
    });

    return Collab;
}