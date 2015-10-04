var bcrypt = require('bcrypt');
var _ = require('underscore');

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
        salt: {
            type: DataTypes.STRING
        },
        password_hash:{
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,  //virtual not stored in db but accessible
            allowNull: false,
            validate: {
                len: [7, 50]
            },
            set: function(value){
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);

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
        },
        instanceMethods: {
            toPublicJSON: function (){
                var json = this.toJSON();  //this refers to instance
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            }

        }
    });




};