module.exports = function(db){
    return{
        // Look for token in request header.  If found and valid, call next() to
        // proceed or 401 if id not found or token invalid
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth');

            db.user.findByToken(token).then(function (user){
                req.user = user;
                next();
            }, function(){
                res.status(401).send();
            })
        }
    }
}