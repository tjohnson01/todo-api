//format for sequelize.import

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [7, 50]
            }
        }
    }, {
        hooks:{
            beforeValidate: function(user, options){
                //user.email -> lowercase
                if(typeof user.email === 'string'){
                    user.email = user.email.toLowerCase();
                }
            }
        }
    });




};