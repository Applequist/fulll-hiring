import { Given, When, Then, World } from '@cucumber/cucumber'
import assert from 'assert';


// TODO: How to extract common step definitions ?!!!
// ... registers ...
// ... has registered ...
// ... tries to register

Given('{word}\'s fleet', async function(user: string) {
    const fleet = await this.Fleets.create(user);
    this.fleets = { [user]: fleet, ...this.fleets };
});

Given('{word} has registered vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = this.fleets[user];
    this.already_registered = !fleet.registerVehicle(plate);
    await this.Fleets.save(fleet);
});

When('{word} registers vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = this.fleets[user];
    this.already_registered = !fleet.registerVehicle(plate);
    await this.Fleets.save(fleet);
});

Then('{word}\'s fleet has {int} registered vehicle(s)', async function(user: string, expected_vehicle_count: number) {
    // Check that loaded entity and database match
    assert(this.fleets[user].vehicles.length == expected_vehicle_count);
    const fleet = await this.Fleets.load(this.fleets[user].id);
    assert(fleet.vehicles.length == expected_vehicle_count);
});

Then('vehicle {string} should be part of {word}\'s vehicle fleet', async function(plate: string, user: string) {
    assert(this.fleets[user].isVehicleRegistered(plate));
    const fleet = await this.Fleets.load(this.fleets[user].id);
    assert(fleet.isVehicleRegistered(plate));
});

Given('vehicle {string} has been registered into {word}\'s fleet', async function(plate: string, user: string) {
    const fleet = this.fleets[user];
    this.already_registered = !fleet.registerVehicle(plate);
    if (!this.already_registered) {
        await this.Fleets.save(fleet);
    }
});

When('{word} tries to register vehicle {string} into his/her fleet', async function(user: string, plate: string) {
    const fleet = this.fleets[user];
    this.already_registered = !fleet.registerVehicle(plate);
    if (!this.already_registered) {
        await this.Fleets.save(fleet);
    }
});

Then('{word} should be informed that vehicle {string} has already been registered into his/her fleet', function(user: string, plate: string) {
    assert(this.already_registered);
});

