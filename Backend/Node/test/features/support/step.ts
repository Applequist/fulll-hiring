import { Given, When, Then, Before } from '@cucumber/cucumber';
import { Fleet } from "../../../src/Domain/Fleet.js";
import { Vehicle } from '../../../src/Domain/Vehicle.js';
import Location from '../../../src/Domain/Location.js';
import assert from 'assert';
import { User } from '../../../src/Domain/User.js';
import InMemoryFleetRepository from '../../../src/Infra/InMemoryFleetRepository.js';
import InMemoryVehicleRepository from '../../../src/Infra/InMemoryVehicleRepository.js';

Before(function () {
        this.fleet_repo = new InMemoryFleetRepository();
        this.vehicle_repo = new InMemoryVehicleRepository();
});

Given('my fleet', async function () {
        const my_fleet = new Fleet(0, 0, 1);
        await this.fleet_repo.save(my_fleet).then(() => {
                this.my_fleet_id = my_fleet.id;
        });
});

Given('the fleet of another user', async function () {
        const alice_fleet = new Fleet(0, 0, 2);
        await this.fleet_repo.save(alice_fleet).then(() => {
                this.alice_fleet_id = alice_fleet.id;
        });
});

Given('a vehicle', async function () {
        this.vehicle_id = "6052XAD";
        await this.vehicle_repo.save(new Vehicle(this.vehicle_id, 0));
});

When('I register this vehicle into my fleet', async function () {
        const my_fleet = await this.fleet_repo.load(this.my_fleet_id);
        my_fleet.registerVehicle(this.vehicle_id);
        await this.fleet_repo.save(my_fleet);
});

Then('this vehicle should be part of my vehicle fleet', async function () {
        const my_fleet = await this.fleet_repo.load(this.my_fleet_id);
        assert(my_fleet.isVehicleRegistered(this.vehicle_id));
});

Given('I have registered this vehicle into my fleet', async function () {
        const my_fleet = await this.fleet_repo.load(this.my_fleet_id);
        my_fleet.registerVehicle(this.vehicle_id);
        await this.fleet_repo.save(my_fleet);
});


Given('a location', function () {
        this.location = new Location({ lon: 10, lat: 20 });
});

Given('this vehicle has been registered into the other user\'s fleet', async function () {
        await this.fleet_repo.load(this.alice_fleet_id).then((other_fleet: Fleet | undefined) => {
                if (other_fleet) {
                        other_fleet.registerVehicle(this.vehicle_id);
                        this.fleet_repo.save(other_fleet);
                } else {
                        throw new Error("Unknown Fleet Exception");
                }
        });
});

Given('my vehicle has been parked into this location', async function () {
        await this.vehicle_repo.load(this.vehicle_id).then((vehicle: Vehicle | undefined) => {
                if (vehicle) {
                        vehicle.parkAt(this.location);
                        this.vehicle_repo.save(vehicle);
                } else {
                        throw new Error("Unknown Vehicle");
                }
        });
});

When('I try to register this vehicle into my fleet', async function () {
        const my_fleet = await this.fleet_repo.load(this.my_fleet_id);
        this.already_registered = !my_fleet.registerVehicle(this.vehicle_id);
});

When('I park my vehicle at this location', async function () {
        const my_vehicle = await this.vehicle_repo.load(this.vehicle_id);
        my_vehicle.parkAt(this.location);
        await this.vehicle_repo.save(my_vehicle);
});

When('I try to park my vehicle at this location', async function () {
        const my_vehicle = await this.vehicle_repo.load(this.vehicle_id);
        this.already_there = !my_vehicle.parkAt(this.location);
});

Then('I should be informed that this vehicle has already been registered into my fleet', function () {
        assert(this.already_registered);
});

Then('the known location of my vehicle should verify this location', async function () {
        const vehicle = await this.vehicle_repo.load(this.vehicle_id);
        assert(vehicle.location.equals(this.location));
});

Then('I should be informed that my vehicle is already parked at this location', function () {
        assert(this.already_there);
});




