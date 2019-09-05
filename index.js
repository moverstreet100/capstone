const express = require("express");
const app = express();
const hbs = require('express-handlebars');
const apiRouter = require('./routes/index');
const path = require("path");
const db = require("./db");

app.set("view engine", "hbs");
app.engine("hbs", hbs({
    extname: "hbs",
}));
// const publicPath = path.join(__dirname, '../views');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(apiRouter);


app.listen(3000, () => {
    console.log("Listening on port 3000");
});