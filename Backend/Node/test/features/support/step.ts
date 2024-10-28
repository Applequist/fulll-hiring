import { Given, When, Then, After, Before, BeforeAll } from '@cucumber/cucumber';
import Location from '../../../src/Domain/Location.js';
import assert from 'assert';

import { configure, POSTGRES } from '../../../src/Infra/Persistence.js';


Before(function() {
    const { Vehicles, Fleets } = configure(POSTGRES);
    this.Vehicles = Vehicles;
    this.Fleets = Fleets;
});

After(async function() {
    await this.Fleets.deleteAll();
    await this.Vehicles.deleteAll();
});

Given('{word}\'s fleet', async function(user: string) {
    const fleet = await this.Fleets.create(user);
    this.fleets = { [user]: fleet.id, ...this.fleets };
});


Given('vehicle {string}', async function(plate: string) {
    const v = await this.Vehicles.create(plate);
    this.vehicles = { [plate]: v.id, ...this.fleets };
});

Given('{word} has registered vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = await this.Fleets.load(this.fleets[user]);
    fleet.registerVehicle(plate);
    await this.Fleets.save(fleet);
});


When('{word} registers vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = await this.Fleets.load(this.fleets[user]);
    fleet.registerVehicle(plate);
    await this.Fleets.save(fleet);
});

Then('vehicle {string} should be part of {word}\'s vehicle fleet', async function(plate: string, user: string) {
    const fleet = await this.Fleets.load(this.fleets[user]);
    console.log(`${user}'s fleet: `, fleet);
    assert(fleet.isVehicleRegistered(plate));
});

Given('location {string}: lon={float} lat={float}', function(loc_tag: string, lon: number, lat: number) {
    this.locations = { [loc_tag]: new Location({ lon, lat }), ...this.locations };
});

Given('vehicle {string} has been registered into {word}\'s fleet', async function(plate: string, user: string) {
    const fleet = await this.Fleets.load(this.fleets[user]);
    fleet.registerVehicle(plate);
    await this.Fleets.save(fleet);
});

Given('vehicle {string} has been parked into location {string}', async function(plate: string, loc_tag: string) {
    const { lon, lat } = this.locations[loc_tag];
    const v = await this.Vehicles.load(plate);
    v.parkAt(new Location({ lon, lat }));
    await this.Vehicles.save(v);
});

When('{word} tries to register vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = await this.Fleets.load(this.fleets[user]);
    this.already_registered = !fleet.registerVehicle(plate);
    if (!this.already_registered) {
        await this.Fleets.save(fleet);
    }
});

When('{word} parks vehicle {string} at location {string}', async function(user: string, plate: string, loc_tag: string) {
    const v = await this.Vehicles.load(plate);
    const { lon, lat } = this.locations[loc_tag];
    v.parkAt(new Location({ lon, lat }));
    await this.Vehicles.save(v);
});

When('{word} tries to park vehicle {string} at location {string}', async function(user: string, plate: string, loc_tag: string) {
    const v = await this.Vehicles.load(plate);
    const { lon, lat } = this.locations[loc_tag];
    this.already_there = !v.parkAt(new Location({ lon, lat }));
});

Then('{word} should be informed that vehicle {string} has already been registered into his/her fleet', function(user: string, plate: string) {
    assert(this.already_registered);
});

Then('the current location of vehicle {string} should be location {string}', async function(plate: string, loc_tag: string) {
    const vehicle = await this.Vehicles.load(plate);
    const { lon, lat } = this.locations[loc_tag];
    assert(vehicle.location.equals(new Location({ lon, lat })));
});

Then('{word} should be informed that vehicle {string} is already parked at location {string}', function(user: string, plate: number, loc_tag: string) {
    assert(this.already_there);
});




