import axios from 'axios';
import fs from 'fs';
import { handleError, checkDateDiff } from './helper';
import { Model, ApiResponse, Api } from './types';

const ENDPOINT = 'https://pokeapi.co/api/v2/pokemon';
const CACHE_FILE = 'cache.json';
const FILTER_CITY = 'kanto';

const getPokemonData = async(search: Model.SearchKey): Promise<Model.Pokemon | null> => {
  return new Promise(async (resolve) => {
    const { response } = await getPokemonByNameOrId(search);

    if (response) {
      const pokemon: Model.Pokemon = {
        id: response.id,
        name: response.name,
        types: response.types,
        location_area_encounters: [],
        stats: response.stats,
      }

      const encounters = (await getPokemonEncounters(response.id)).response?.filter((item) => {
        return item.location_area.name.startsWith(FILTER_CITY);
      }) ?? [];

      pokemon.location_area_encounters = encounters.map((item) => {
        return {
          name: item.location_area.name,
          url: item.location_area.url,
        }
      });

      await Promise.all(pokemon.location_area_encounters.map(async (method, index) => {
        const locationArea = (await getPokemonEncounterMethods(method.url)).response;
        const methods: Model.PokemonEncounterMethod[] = [];

        locationArea?.encounter_method_rates.forEach(async (locationArea) => {
          methods.push(locationArea.encounter_method.name);
        });

        pokemon.location_area_encounters[index] = {
          ...pokemon.location_area_encounters[index],
          methods
        };
      }));

      resolve(pokemon);
    }

    resolve(null);
  });
}

const getPokemonByNameOrId = async (search: Model.SearchKey): Promise<ApiResponse<Api.Pokemon>> => {
  try {
    const api = await axios(`${ENDPOINT}/${search}`);
    return { success: true, response: api.data }
  } catch (error) {
    return handleError(error);
  }
}

const getPokemonEncounters = async (id: number): Promise<ApiResponse<Api.PokemonEncounter[]>> => {
  try {
    const api = await axios(`${ENDPOINT}/${id}/encounters`);
    return { success: true, response: api.data }
  } catch (error) {
    return handleError(error);
  }
}

const getPokemonEncounterMethods = async (url: string): Promise<ApiResponse<Api.PokemonLocationArea>> => {
  try {
    const api = await axios(url);
    return { success: true, response: api.data }
  } catch (error) {
    return handleError(error);
  }
}

const writeData = async (dataToWrite: Model.Pokemon, index = -1): Promise<void> => {
  return new Promise((resolve) => {
    fs.readFile(CACHE_FILE, 'utf8', function readFileCallback(readFileError, dataFromFile){
      if (readFileError) {
        console.log(readFileError);
        resolve();
      } else {
        let json = '';
        dataToWrite.createdAt = new Date();

        try {
          const data: Model.Pokemon[] = JSON.parse(dataFromFile);

          if (index === -1) {
            data.push(dataToWrite);
          } else {
            data[index] = dataToWrite;
          }

          json = JSON.stringify(data);
        } catch (error: unknown) {
          json = JSON.stringify([dataToWrite]);
        }

        fs.writeFile(CACHE_FILE, json, 'utf8', () => {
          resolve();
        });
      }
    });
  });
}

export const allData = async (): Promise<Model.Pokemon[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(CACHE_FILE, 'utf8', async function readFileCallback(err, dataFromFile){
      try {
        const data: Model.Pokemon[] = JSON.parse(dataFromFile);
        resolve(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          resolve([]);
        }
      }
    });
  });
}

export const searchData = async (search: Model.SearchKey): Promise<Model.Pokemon | null | string> => {
  return new Promise(async (resolve) => {
    try {
      await fs.promises.readFile(CACHE_FILE);
    } catch (error) {
      await fs.promises.writeFile(CACHE_FILE, '');
    }

    fs.readFile(CACHE_FILE, 'utf8', async function readFileCallback(readFileError, dataFromFile){
      if (readFileError) {
        console.log(readFileError);
        resolve(null);
      } else {
        try {
          const data: Model.Pokemon[] = JSON.parse(dataFromFile);
          const findIndex = data.findIndex((item) => {
            return item.id === parseInt(search) || item.name === search;
          });

          if (findIndex === -1) {
            const pokemon = await getPokemonData(search);

            if (pokemon) {
              await writeData(pokemon);
              resolve(pokemon)
            } else {
              resolve(null);
            }
          } else {
            const searchResult = data[findIndex];
            const dateDiff = checkDateDiff(new Date(), new Date(searchResult.createdAt ?? ''));

            if (dateDiff >= 7) {
              const pokemon = await getPokemonData(search);

              if (pokemon) {
                await writeData(pokemon, findIndex);
                resolve(pokemon);
              } else {
                resolve(null);
              }
            } else {
              resolve(searchResult);
            }
          }
        } catch (error: unknown) {
          if (error instanceof SyntaxError) {
            console.log('The cache file is empty, continuing to writing.')
            const pokemon = await getPokemonData(search);

            if (pokemon) {
              await writeData(pokemon);
              resolve(pokemon)
            } else {
              resolve(null);
            }
          } else if (error instanceof Error) {
            console.log(error);
            resolve(null);
          }
        }
      }
    });
  });
}
