## Database migrations:

```sh
node migrate --help # show CLI help

node migrate up # apply migrations
node migrate down # revert the last migration
node migrate down --to 0 # revert all migrations
node migrate up --step 2 # run only two migrations

node migrate create --folder migrations/ --name new-migration.ts # create a new migration file
```

## Running the test

### In memory

1. Configure the storage mode in `step.js`

```js
Before(function() {
    const [Vehicles, Fleets] = config("memory"); // "postgres" or "memory"
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});
```

2. Run the test:

```sh
$ npm run test
```

### Using postgresql

1. Pull postgresql official docker image.
2. Edit `.env.test` 
3. Start the local database:

```sh
$ ./start_db.sh
```

4. Configure the storage mode in `step.js`

```js
Before(function() {
    const [Vehicles, Fleets] = config("postgres"); // "postgres" or "memory"
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});
```

5. Run the test

```sh
$ npm run test
```
