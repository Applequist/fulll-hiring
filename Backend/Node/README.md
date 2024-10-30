## Project Setup

- Use node lts/iron (20.18.0)
- typescript config:
    - module: node16
    - moduleResolution: node16
- type: "module"

That is .ts files are compiled into CommonJS javascript modules.

FIXME: I'd rather have .ts files compiled into ESM javascript modules (by adding type: "module" in package.json) 
but this breaks the migrate/umzug setup and I can't fix it. So I'd have to live with CommonJs module for now...

### Dependencies

- db: Postgres running in Docker
- Sequelize for data access. I would use something simpler like postgres.js but that gives us more choice for the db.
- Umzug for db migrations
- Commander for the CLI
- dotenvx: to inject DB information into Node process.env

## Design Decisions

### Domain model

We have 2 entities:
- Vehicle 
- Fleet

1 value: Location, 

And 1 many-to-many relationship between Fleet and Vehicle, although it is only navigable from
Fleet to Vehicle.

A vehicle is modelled as a natural id as the license plate and a location (longitude and latitude).
The Fleet is simply modelled as a generated integer id and a owner user id (string).
The Fleet entity relation is *modelled* as an array of vehicle ids which are all fetched when loading the Fleet 
(this could becomes a performance issue of a fleet contains *a lot* of vehicles).

Both entities have a `version` field to prevent lost updates. This is especially useful for vehicles which can be shared between fleets (and their owner)

The DB also includes an index for both entities on their id.

### Database persistence:

#### Database setup

1. Pull official Postgres Docker image.

2. Export DB information into '.env.test':

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PWD=mysecretpassword
DB_NAME=fleetdb
```

3. Start db: 

```sh
$ ./start_db.sh
```

4. Run migrations

```sh
$ node migrate up
```

See `migrations/` for database schema definition.

#### Using migrate

```sh
node migrate --help # show CLI help

node migrate up # apply migrations
node migrate down # revert the last migration
node migrate down --to 0 # revert all migrations
node migrate up --step 2 # run only two migrations

node migrate create --folder migrations/ --name new-migration.ts # create a new migration file
```

## API or no API

Not sure from the instructions whether the CLI should access the domain model through an API. Did not do it.

## CLI

```sh
$ npm run fleet -- --help

> project@1.0.0 fleet
> dotenvx run -f .env.test -- node dist/src/bin/fleet --help

[dotenvx@1.20.0] injecting env (5) from .env.test
Usage: fleet [options] [command]

Manage fleets of vehicles

Options:
  -h, --help                                                   display help for command

Commands:
  create <userId>                                              create a new fleet owned by the given user and returns the new
                                                               fleet's id.
  register-vehicle <number> <string>                           register a (new) vehicle into a fleet
  unregister-vehicle <number> <string>                         unregister a  vehicle from a fleet
  localize-vehicle <fleetId> <vehiclePlateNumber> <lon> <lat>  update a vehicle current location
  help [command]                                               display help for command
```

## Running the test

### In memory

1. Configure the storage mode in `step.js`

```js
import { configure, POSTGRES } from '../../../src/Infra/Persistence.js';

Before(function() {
    const { Vehicles, Fleets } = configure("memory"); // "postgres" or "memory"
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});
```

2. Run the test:

```sh
$ npm run test
```

### Using postgresql

1. Setup database (see Database persistence)
2. Configure the storage mode in `step.js`

```js
import { configure, POSTGRES } from '../../../src/Infra/Persistence.js';

Before(function() {
    const { Vehicles, Fleets } = config(POSTGRES); // "postgres" or "memory"
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});
```

5. Run the test

```sh
$ npm run test
```
