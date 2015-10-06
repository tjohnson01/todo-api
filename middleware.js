var cryptojs = require('crypto-js');

module.exports = function(db){
    return{
        // Look for token in request header.  If found and valid, call next() to
        // proceed or 401 if id not found or token invalid
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth');

            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function (tokenInstance){
                if(!tokenInstance){
                    throw new Error();
                }

                req.token = tokenInstance;
                return db.user.findByToken(token);
            }).then(function (user){
                req.user = user;
                next();
            }).catch(function (){
                res.status(401).send();
            });
        }
    };
};