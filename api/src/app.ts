import express, { Request, Response } from 'express';
import { allData, searchData } from './core';
import { handleError } from './helper';

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`PokéAPI is running on port ${port}.`);
});

app.get('/', async (req: Request, res: Response) => {
  const pokemons = await allData();

  if (pokemons.length > 0) {
    res.send(pokemons);
  } else {
    res.send(handleError('No data.'));
  }
});

app.get('/:search', async (req: Request, res: Response) => {
  const { search } = req.params;
  const pokemon = await searchData(search);

  if (pokemon) {
    res.send(pokemon);
  } else {
    res.send(handleError('No data.'));
  }
});
