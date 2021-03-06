const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));




app.use(cors({
    origin:['http://localhost:8080', 'https://localhost:8080', "https://crimemap.bytenaija.com.ng", "http://crimemap.bytenaija.com.ng", "https://bytenaija.com.ng", "http://bytenaija.com.ng"],
    methods:['GET','POST', 'DELETE', 'PUT'],
    credentials: true // enable set cookie
}));
const crimeroutes = require('./app/routes/crime.routes');
const userroutes = require('./app/routes/user.routes');

const morgan = require('morgan');



const dbConfig = require("./config/database.config.js");
const jwtConfig = require("./config/jwt.config");
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const mongo_uri = process.env.PROD_MONGODB || dbConfig.url;
mongoose.connect(mongo_uri);

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

app.use(morgan('dev'));




app.use('/api/', crimeroutes);
app.use('/api/user/', userroutes);

app.listen(port, ()=>{
    console.log("Server is listening on port " + port);
});