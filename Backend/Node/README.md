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

Configure the storage mode in `step.js`:

```js
Before(function() {
    const [Vehicles, Fleets] = config("postgres"); // "postgres" or "memory"
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});
```

If you choose `postgres`, start the database locally runing `./start_db.sh`

Run the test:

```sh
npm run test
```

