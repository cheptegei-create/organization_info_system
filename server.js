/* const express = require('express'); */
const routes = require('./routes/info');
const sequelize = require('./config/connection');

/* const app = express();
const PORT = process.env.PORT || 3001;

// turn on routes
app.use(routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));*/



// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  clientInteraction();
});