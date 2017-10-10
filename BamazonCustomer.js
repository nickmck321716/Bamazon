//----------------------------------------------------------------------------------
//MySQL Bamazon Database script to be found in the file
//"mySQL_Script_Bamazon_Database"
//----------------------------------------------------------------------------------

//Requiring sql and npm prompt
var mysql = require("mysql");
var prompt = require("prompt");

//establishing msql connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon'
});


//calling and displaying database to user
var execute = function() {

    connection.query("SELECT * FROM products", function(err, result) {
        return (prettyTable(result));

    });
//fuction to prompt user for item id and stock quantity then check inventory 
    setTimeout(function() {
        prompt.start();
        prompt.get(['item_id', 'stock_quantity'], function(err, result) {
            var item = result.item_id;
            var quantity = result.stock_quantity
            inventoryCheck(item, quantity);
            setTimeout(function() { execute(); }, 3500);
        });
    }, 750);
}
//fuction to check and update inventory for user reqested item and quantity
var inventoryCheck = function(id, quantity) {
    connection.query('SELECT * FROM Products WHERE item_id = ' + id, function(err, result) {
        if (err) console.log("error1");

        var total = result[0].price * quantity;

        var inventory = result[0].stock_quantity - quantity;

        //console logging if not enough stock or the quantity and item user bought and remaing quantity of product
        if (inventory < 0) {
            console.log('Insufficient stock. There are only ' + result[0].stock_quantity + ' item(s) left.');
        } else {
            console.log('User has bought ' + quantity + ' ' + result[0].product_name + ' for $' + total);
            console.log('There are ' + inventory + ' ' + result[0].product_name + ' remaining.')
            databaseUpdate(id, inventory)
        }
    });
}
//updating the database 
var databaseUpdate = function(id, quantity) {
    connection.query('update products set stock_quantity = ' + quantity + ' where item_id = ' + id, function(err, result) {
        if (err)
            console.log("error2");
    });
}
//diplaying the table in readable format
function prettyTable(items) {
    for (var i = 0; i < items.length; i++) {
        console.log('------------------------');
        console.log('item_id: ' + items[i].item_id);
        console.log('item: ' + items[i].product_name);
        console.log('department: ' + items[i].department_name);
        console.log('price: $' + items[i].price);
    }
    console.log('------------------------');
}

//connection to database
connection.connect(function(err) {
    if (err) {
        console.log("error3");
        return;
    }
});
//excecuting script
execute();