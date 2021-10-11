<p align="center" width="100%">
    <img width="33%" src="https://acepointer.sg/wp-content/uploads/2020/11/Ap_Logo@2x.png">
</p>

# PokéAPI Data Search

This is an application as an assignment task for Ace Pointer.

## Directory Structure

    .
    ├── api                     # API server files
    │   ├── src
    │   │   ├── app.ts          # NodeJS Express application to server the API
    │   │   ├── core.ts         # Typescript file that holds core functions
    │   │   ├── helper.ts       # Typescript file that holds helper functions
    │   │   └── types.ts        # Types definition of the API
    │   ├── .gitignore
    │   ├── package.json        # Packages list that needs to be installed
    │   ├── tsconfig.json       # Typescript config to be used
    │   ├── yarn.lock           # Lock file of packages list to keep the integrity
    │   └── README.md
    ├── app                     # Command-line based Python application to navigate the data
    │   ├── app.py              # Python file to run the application
    │   └── requirements.txt    # Packages list that needs to be installed
    ├── .gitignore
    └── README.md

## Requirements

- Node v14 or above
- npm v7 or above or yarn v1.22 (yarn preferred)
- Python3
- pip3

## Installation

1. Clone this repository

### API Preparation

1. Navigate to `api` folder and run this command to install `api`'s packages:

```bash
npm install
```

or

```bash
yarn install
```

2. Run this command to serve the API in development mode and detect any changes:

```bash
npm run dev
```

or

```bash
yarn dev
```

3. The API is served to `http://127.0.0.1:3001`

### Application Preparation

1. Navigate to `app` folder and run this command to install `app`'s packages:

```bash
pip3 install -r requirements.txt
```

2. Run this command to run the application:

```bash
python3 app.py
```

## Configuration

- Cache will be saved to `cache.json` file and can be found in `api/src/core.ts`:

```typescript
const CACHE_FILE = "cache.json";
```

- City filter can be found in `api/src/core.ts`:

```typescript
const FILTER_CITY = "kanto";
```

- API port can be found in `api/src/app.ts`:

```typescript
const port = 3001;
```

- API's build folder configuration can be found in `api/tsconfig.json`:

```json
...
   "outDir": "./build",
...
```

- The application API's endpoint can be found in `app/app.py`:

```python
ENDPOINT = "http://127.0.0.1:3001"
```

## API Production Mode

You can run this command to build and run the API:

```bash
npm run start
```

or

```bash
yarn start
```

Or just want to build the API:

```bash
npm run build
```

or

```bash
yarn build
```

After that, the build file will be saved into `api/build` and the structure will be like this:

    .
    ├── build
    │   ├── app.js
    │   ├── core.js
    │   ├── helper.js
    └── └── types.js

And the API can be run using this command:

```bash
node api/build/app.js
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
