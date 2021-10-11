export interface ApiResponse<T> {
  success: boolean;
  response?: T;
  message?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export namespace Model {
  export type PokemonEncounterMethod = string;
  export type SearchKey = string;

  export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    location_area_encounters: PokemonEncounter[];
    stats: [];
    createdAt?: Date;
  }

  interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }

  export interface PokemonEncounter {
    name: string;
    url: string;
    methods?: PokemonEncounterMethod[];
  }

  export interface PokemonLocationArea {
    encounter_method_rates: PokemonEncounterRate[];
  }

  interface PokemonEncounterRate {
    name: string;
  }
}

export namespace Api {
  export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    location_area_encounters: string;
    stats: [];
  }

  interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }

  export interface PokemonEncounter {
    location_area: {
      name: string;
      url: string;
    }
  }

  export interface PokemonLocationArea {
    encounter_method_rates: PokemonEncounterRate[];
  }

  export interface PokemonEncounterRate {
    encounter_method: {
      name: string;
      url: string;
    }
  }

  export interface PokemonEncounterMethod {
    name: string;
    names: PokemonEncounterMethodName[];
  }

  export interface PokemonEncounterMethodName {
    name: string;
    language: {
      name: string;
    }
  }
}
