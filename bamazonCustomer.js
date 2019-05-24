// Setting up enviroment required for app
const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');
const inquirer = require('inquirer');
const { table } = require('table');
/** The following code was found as a tutorial at https://know-thy-code.com/importing-csv-data-mysql/. **/
// Loading csv file
let stream = fs.createReadStream("products.csv");
console.log("Loading csv file into bamazonDB");

//Parsing CSV module and setting variables
let productArray = [];
let chosenProduct = [];
let csvStream = csv.parse().on("data", function (data) {
    productArray.push(data);
}).on("end", function () {
    // Removing the first element in the array
    productArray.shift();

    // Create a new connection to the database 
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'node_user',
        password: '',
        database: 'amazonDB'
    });

    // open the connection
    connection.connect((error) => {
        if (error) {
            console.error(error);
        }
        else {
            let query = 'INSERT INTO products (sku, product_name, department_name, price, stock_quantity) VALUES ?';
            connection.query(query, [productArray], (error, response) => {
                console.log(error || response);
                console.log("csv file has been loaded!");
                // Pausing stream
                csvStream.pause();
                // Required functions
                displayCurrentItems();
                customerQuestions();
            });
        }
    });
    // Functions
    function displayCurrentItems() {
        console.log("The following products are available")
        var header = [["sku", "Product", "Department", "Price", "Quantity"]];
        connection.query('SELECT*FROM products;', function (err, results) {
            // Catch any errors
            if (err) throw error;
            for (let row of results) {
                displayRow = [];
                displayRow.push(row.sku);
                displayRow.push(row.product_name);
                displayRow.push(row.department_name);
                displayRow.push(row.price);
                displayRow.push(row.stock_quantity);
                header.push(displayRow);
            }
            output = table(header);
            console.log(output);
        });
    }
    function customerQuestions() {
        connection.query('SELECT product_name FROM products;', function (err, results){
            // Catching errors
            if (err) throw error;
            for (let product of results) {
                chosenProduct.push(product.product_name);
            }
        })
        inquirer.prompt([
            {
                name: "purchase",
                message: "Would you like to buy a product?",
                type: "confirm"
            }            
        ]).then(answers => {
            if (answers.purchase) {
                inquirer.prompt ([
                    {
                        name: "product",
                        message: "Which product would you like to purchase?",
                        type: "list",
                        choices: chosenProduct
                    },
                    {
                        name: "quantity",
                        message: "How many items would you like to buy?",
                        type: "input",
                        validate: function(input) {
                            if (isNaN(input) === true) {
                                return "A number must be entered.";
                            }
                            return true;
                        }
                    }
                ])
            }
        });
        
    }
});
stream.pipe(csvStream);