const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const connection = require('../app/config/connections');

app.use(cors());
app.use(cookieParser());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require('../app/middlewares/passport')(passport);
require('../routes/web')(app);

//Create The Database.
app.get('/createdatabase', (req, res) => {
  let sql = 'CREATE DATABASE employee';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send('Database Created');
  });
});
app.listen(port, () => {
  console.log(`Listening on the Server ${port}`);
});
