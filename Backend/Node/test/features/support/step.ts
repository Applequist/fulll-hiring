import { Given, When, Then, After, Before, BeforeAll } from '@cucumber/cucumber';
import { Fleet, FleetRepository } from "../../../src/Domain/Fleet.js";
import { Vehicle, VehicleRepository } from '../../../src/Domain/Vehicle.js';
import Location from '../../../src/Domain/Location.js';
import assert from 'assert';
import InMemoryFleetRepository from '../../../src/Infra/InMemoryFleetRepository.js';
import InMemoryVehicleRepository from '../../../src/Infra/InMemoryVehicleRepository.js';
import SqlFleetRepository from '../../../src/Infra/SqlFleetRepository.js';

import { Sequelize } from 'sequelize'
import SqlVehicleRepository from '../../../src/Infra/SqlVehicleRepository.js';

function config(db: "memory" | "postgres"): [VehicleRepository, FleetRepository] {
    if (db == "memory") {
        return [new InMemoryVehicleRepository(), new InMemoryFleetRepository()];
    } else {
        const sequelize = new Sequelize({
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: process.env.DB_PWD, // 'mysecretpassword',
            database: 'fleetdb',
            dialect: 'postgres',
            // logging: (...msg) => console.log(msg),
            pool: {
                min: 2,
                max: 10
            }
        });
        return [new SqlVehicleRepository(sequelize), new SqlFleetRepository(sequelize)];
    }
}

Before(function () {
    const [Vehicles, Fleets] = config("postgres");
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});

After(async function () {
    await this.Fleets.deleteAll();
    await this.Vehicles.deleteAll();
});

Given('my fleet', async function () {
    const my_fleet = await this.Fleets.create("Bob");
    this.my_fleet_id = my_fleet.id;
});

Given('the fleet of another user', async function () {
    const alice_fleet = await this.Fleets.create("Alice");
    this.alice_fleet_id = alice_fleet.id;
});

Given('a vehicle', async function () {
    this.vehicle_id = "6052XAD";
    const v = await this.Vehicles.create(this.vehicle_id);
});

When('I register this vehicle into my fleet', async function () {
    const my_fleet = await this.Fleets.load(this.my_fleet_id);
    my_fleet.registerVehicle(this.vehicle_id);
    await this.Fleets.save(my_fleet);
});

Then('this vehicle should be part of my vehicle fleet', async function () {
    const my_fleet = await this.Fleets.load(this.my_fleet_id);
    assert(my_fleet.isVehicleRegistered(this.vehicle_id));
});

Given('I have registered this vehicle into my fleet', async function () {
    const my_fleet = await this.Fleets.load(this.my_fleet_id);
    my_fleet.registerVehicle(this.vehicle_id);
    await this.Fleets.save(my_fleet);
});


Given('a location', function () {
    this.location = new Location({ lon: 10, lat: 20 });
});

Given('this vehicle has been registered into the other user\'s fleet', async function () {
    const alice_fleet = await this.Fleets.load(this.alice_fleet_id);
    alice_fleet.registerVehicle(this.vehicle_id);
    await this.Fleets.save(alice_fleet);
});

Given('my vehicle has been parked into this location', async function () {
    const v = await this.Vehicles.load(this.vehicle_id);
    v.parkAt(this.location);
    await this.Vehicles.save(v);
});

When('I try to register this vehicle into my fleet', async function () {
    const my_fleet = await this.Fleets.load(this.my_fleet_id);
    this.already_registered = !my_fleet.registerVehicle(this.vehicle_id);
});

When('I park my vehicle at this location', async function () {
    const my_vehicle = await this.Vehicles.load(this.vehicle_id);
    my_vehicle.parkAt(this.location);
    await this.Vehicles.save(my_vehicle);
});

When('I try to park my vehicle at this location', async function () {
    const my_vehicle = await this.Vehicles.load(this.vehicle_id);
    this.already_there = !my_vehicle.parkAt(this.location);
});

Then('I should be informed that this vehicle has already been registered into my fleet', function () {
    assert(this.already_registered);
});

Then('the known location of my vehicle should verify this location', async function () {
    const vehicle = await this.Vehicles.load(this.vehicle_id);
    assert(vehicle.location.equals(this.location));
});

Then('I should be informed that my vehicle is already parked at this location', function () {
    assert(this.already_there);
});




