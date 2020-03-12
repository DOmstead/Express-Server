require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');



console.log(process.env.API_TOKEN);

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'Tiny': 'dev';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req,res,next) {
  console.log('validate bearer token middleware');
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if ( !authToken || apiToken !== authToken.split(' ')[1]){
    return res.status(401).json({error: 'Unauthorized Request'});
  }
  next();
});

const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']

app.get('/types', function handleGetTypes(req, res) {
  res.json(validTypes);
});

app.get('/pokemon', function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }

  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    );
  }

  res.json(response);
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>  {
  console.log(`Listening on Port ${PORT}`);
});

console.log('Hi There');

