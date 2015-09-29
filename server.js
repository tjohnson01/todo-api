var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    res.json(todos);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10),
        matchedTodo = _.findWhere(todos, {id: todoId});

    if(typeof matchedTodo !== 'undefined')
        res.json(matchedTodo);
    else
        res.send('Not found: ID = ' + todoId);
});

// POST /todos
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'completed', 'description'); // use _.pick to only pick description

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.id = todoNextId++;
    body.description = body.description.trim();
    todos.push(body);

    res.json(body);
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


app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT);
});