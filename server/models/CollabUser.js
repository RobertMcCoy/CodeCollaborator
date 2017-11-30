var sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
    var CollabUser = sequelize.define('CollabUser', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        collab_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return CollabUser;
}
