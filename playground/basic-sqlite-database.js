var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var User = sequelize.define('user', {
    email: Sequelize.STRING
});

// creates association
Todo.belongsTo(User);
User.hasMany(Todo);


// force: true drops and recreates all tables in the db
sequelize.sync({
    // force: true
}).then(function() {
    console.log('Everything is synced');

    User.findById(1).then(function (user){
        user.getTodos({
            where: {
                completed: true
            }
        }).then(function(todos){
            todos.forEach(function(todo){
                
                    console.log(todo.toJSON());
                
            });
        });
    });

    // User.create({
    //     email: 'test@example.com'
    // }).then(function(){
    //     Todo.create({
    //         description: 'clean yard'
    //     }).then(function (todo){
    //         User.findById(1).then(function(user){
    //             user.addTodo(todo);
    //         })
    //     });
//    })






    //fetch todo by its id and print it out as json
    //if not found, print not found
    // Todo.findById(2).then(function(todo) {
    //     if (todo) {
    //         console.log(todo.toJSON());
    //     } else {
    //         console.log("Todo not found");
    //     }

    //     throw new Error('test');
    // }).catch(function(e) {
    //     console.log("Error caught: " + e);
    // });
});



//     console.log('Everything is synced');

//     Todo.create({
//         description: 'walking my dog',
//         completed: false
//     }).then(function(todo) {
//         return Todo.create({
//             description: 'Clean office'
//         });
//     }).then(function() {
//         //return Todo.findById(1);
//         return Todo.findAll({
//             where:{
//                 completed: false
//             }
//         })
//     }).then(function(todos) {
//         if (todos){
//             todos.forEach(function(todo){
//                 console.log(todo.toJSON());
//             });
//         }

//         else
//             console.log('no todo found');
//     }).catch(function(e) {
//         console.log(e);
//     });
// });









// Array Example
/*

    array of grades
    function called addgrade, pushes new value

    assign one
u




var grades = [99, 82];

function addGrade(arr, grade){
    //arr.push(grade);
    //arr[5]= 7;
    arr = [10,20,30];

}

addGrade(grades, 90);
console.log(grades);
*/