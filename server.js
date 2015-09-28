var express = require('express');
var bodyParser = require('body-parser');

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
        ret;

    todos.forEach(function(item){
        if(item.id === todoId)
            ret = item;
    });

    console.log('ret = ' + ret);

    if(typeof ret !== 'undefined')
        res.json(ret)
    else
        res.send('Not found: ID = ' + todoId);
});

// POST /todos
app.post('/todos', function(req, res){
    var body = req.body;

    body.id = todoNextId;
    todos.push(body);
    todoNextId += 1;

    console.log(todos);

    res.json(todos[todos.length -1]);
});


app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT);
});