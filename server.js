var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false

}, {
    id: 2,
    description: 'Go to market',
    completed: false
}, {
    id: 3,
    description: 'Wash car',
    completed: false
}];


app.get('/', function (req, res){
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
})

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10),
        ret;

    todos.forEach(function(item){
        if(item.id === todoId)
            ret = item;
    })

    //console.log('ret = ' + ret);

    if(typeof ret !== 'undefined')
        res.json(ret)
    else
        res.send('Not found: ID = ' + todoId);
});
// GET /todos/:id

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT);
})