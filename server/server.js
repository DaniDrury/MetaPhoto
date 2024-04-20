require('dotenv').config( {path: "../.npmrc"} );
const express = require ('express');
const path = require('path');
const api = require('./routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

if (process.env.NODE_ENV === 'production') {
  console.log("I'm in the IF");
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
} else {
  console.log("I'm in the ELSE");
  app.use(express.static(path.join(__dirname, '../client/index.html')));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

