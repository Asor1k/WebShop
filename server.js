'use strict';

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());


app.get("/getAllItems", function(req, res) {
	db.all(
		"SELECT id, brand, model, os, image, screensize FROM phones",
		function(err,rows){
			if (err) {
				res.status(400).json({ "status": false, "result": 'Failed!' });
			 }
			 else {
				res.status(200).json({ "status": true, "result": rows });
			}
		}
	)
});

app.post("/addNewItem", function(req, res) {
	var bodi = req.query;
	db.run(
		`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
		[bodi['brand'], bodi['model'], bodi['os'], bodi['image'], bodi['screensize']],
		function(err) {
			if (err) {
				res.status(400).json({ "status": false, "result": err });
			 }
			 else {
				res.status(201).json({ "status": true, "result": `Successfully added! ID: ${this.lastID}` });
			 }
		}
	)
});


app.get("/getPhone/:id", function(req, res) {
	var phoneId = req.params.id;
	db.all(
		"SELECT id, brand, model, os, image, screensize FROM phones WHERE id=" + phoneId,
		function(err,rows){
			if (err) {
				res.status(400).json({ "status": false, "result": 'Selecting item Failed!' });
			 }
			 else {
				res.status(200).json({ "status": true, "result": rows });
			 }


		}
	)
});

app.put("/updatePhone/:id", function(req, res) {
	var phoneId = req.params.id;
	var bodi = req.query;
	db.run(
		`UPDATE phones SET brand=?, model=?, os=?, image=?, screensize=? WHERE id=?`,
		[bodi['brand'], bodi['model'], bodi['os'], bodi['image'], bodi['screensize'], phoneId],
		function(err){
			if (err) {
				res.status(400).json({ "status": false, "result": 'Update failed!' });
			 }
			 else {
				res.status(200).json({ "status": true, "result": `${this.changes} item(s) Successfully Updated! ` });
			 }

		}
	)
});

app.delete("/deletePhone/:id", function(req, res) {
	var phoneId = req.params.id;
	db.run(
		"DELETE FROM phones WHERE id=" + phoneId,
		function(err){
			if (err) {
				res.status(400).json({ "status": false, "result": 'Failed to delete!' });
			 }
			 else {
				res.status(200).json({ "status": true, "result": `${this.changes} item(s) Successfully Deleted! ` });
			 }
		 }
	)
});

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

function my_database(filename) {
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});

	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id INTEGER PRIMARY KEY,
        	brand CHAR(100) NOT NULL,
        	model CHAR(100) NOT NULL,
        	os CHAR(10) NOT NULL,
        	image CHAR(254) NOT NULL,
        	screensize 	INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
