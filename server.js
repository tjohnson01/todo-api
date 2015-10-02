var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};

    //filter 
    if(query.hasOwnProperty('completed') && (query.completed === 'true' || query.completed === 'false')){
        where.completed = (query.completed === 'true');
    } //else{
      //  res.status(400).json('Missing completed property');
    //}

    console.log(query.completed === 'true' || query.complted === 'false');
    if(query.hasOwnProperty('q') && query.q.trim().length > 0){
        where.description = query.q.trim();
    }

    console.log(where);

    if(where.hasOwnProperty('completed') || where.hasOwnProperty('description')){
        db.todo.findAll({
            where : where
        }).then(function(results){
            res.json(results);
        }, function(err){
            res.json(err);
        });
    } else{
        res.status(400).json('Missing object properties to search');
    }

    // var filteredTodos = todos;

    // if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    //     filteredTodos = _.where(filteredTodos, {completed: true});
    // } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
    //     filteredTodos = _.where(filteredTodos, {completed: false});
    // }

    // if(queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0){
    //     filteredTodos = _.filter(filteredTodos, function(obj){
    //         return obj.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    //     });
    // }

    // res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(t) {
        if (t) {
            res.json(t.toJSON());
        } else {
            res.status(404).json("No todo found");
        }

        //throw new Error('test');
    }).catch(function(e) {
        console.log("Error caught: " + e);
        res.status(500).send();
    });
});

/* alternative version

// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    });
});

*/


// POST /todos
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'completed', 'description'); // use _.pick to only pick description

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    },  function(e){
        res.status(400).json(e);
    });

});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(!matchedTodo)
        res.status(404).json({"error": "no todo found with that ID"});
    else{
        //remove element from array
        todos = _.without(todos, matchedTodo);
        res.json(todos);
    }

});

// PUT
app.put('/todos/:id', function(req, res){
    var body = _.pick(req.body, 'completed', 'description'); // use _.pick to only pick description
    var validAttributes = {};
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(!matchedTodo)
        return res.status(404).send();

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description.trim();
    } else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);

    res.json(todos);  //res.json automatically sends back a 200
});


db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT);
    });    
});

