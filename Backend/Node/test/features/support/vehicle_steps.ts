import { Given, When, Then } from '@cucumber/cucumber'
import Location from '../../../src/Domain/Location.js'
import assert from 'assert'

Given('vehicle {string}', async function(plate: string) {
    const v = await this.Vehicles.create(plate);
    this.vehicles = { [plate]: v, ...this.fleets };
});

Given('location {string}: lon={float} lat={float}', function(loc_tag: string, lon: number, lat: number) {
    this.locations = { [loc_tag]: new Location({ lon, lat }), ...this.locations };
});

Given('vehicle {string} has been parked into location {string}', async function(plate: string, loc_tag: string) {
    const v = this.vehicles[plate];
    const { lon, lat } = this.locations[loc_tag];
    v.parkAt(new Location({ lon, lat }));
    await this.Vehicles.save(v);
});

When('{word} parks vehicle {string} at location {string}', async function(user: string, plate: string, loc_tag: string) {
    const v = this.vehicles[plate];
    const { lon, lat } = this.locations[loc_tag];
    v.parkAt(new Location({ lon, lat }));
    await this.Vehicles.save(v);
});

When('{word} tries to park vehicle {string} at location {string}', async function(user: string, plate: string, loc_tag: string) {
    const v = this.vehicles[plate];
    const { lon, lat } = this.locations[loc_tag];
    this.already_there = !v.parkAt(new Location({ lon, lat }));
    if (!this.already_there) {
        this.Vehicles.save(v);
    }
});

Then('the current location of vehicle {string} should be location {string}', async function(plate: string, loc_tag: string) {
    assert(this.vehicles[plate].location.equals(this.locations[loc_tag]));
    const vehicle = await this.Vehicles.load(plate);
    assert(vehicle.location.equals(this.locations[loc_tag]));
});

Then('{word} should be informed that vehicle {string} is already parked at location {string}', function(user: string, plate: number, loc_tag: string) {
    assert(this.already_there);
});

