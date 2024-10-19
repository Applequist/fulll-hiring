import { Given, When, Then } from '@cucumber/cucumber';
import Fleet from "../../../src/Domain/Fleet.js";
import Vehicle from '../../../src/Domain/Vehicle.js';
import Location from '../../../src/Domain/Location.js';
import assert from 'assert';

Given('my fleet', function() {
	this.fleet = new Fleet(1, "Default Fleet");
});

Given('the fleet of another user', function() {
	this.joes_fleet = new Fleet(2, "Joe's Fleet");
});

Given('a vehicle', function() {
	this.vehicle = new Vehicle("6052XAD");
});

Given('a location', function() {
	this.location = new Location({ lon: 10, lat: 20 });
});

Given('I have registered this vehicle into my fleet', function() {
	this.fleet.registerVehicle(this.vehicle);
});

Given('this vehicle has been registered into the other user\'s fleet', function() {
	this.joes_fleet.registerVehicle(this.vehicle);
});

Given('my vehicle has been parked into this location', function() {
	this.vehicle.parkAt(this.location);
});

When('I register this vehicle into my fleet', function() {
	this.fleet.registerVehicle(this.vehicle);
});

When('I try to register this vehicle into my fleet', function() {
	this.already_registered = !this.fleet.registerVehicle(this.vehicle);
});

When('I park my vehicle at this location', function() {
	this.vehicle.parkAt(this.location);
});

When('I try to park my vehicle at this location', function() {
	this.already_there = !this.vehicle.parkAt(this.location);
});

Then('this vehicle should be part of my vehicle fleet', function() {
	assert(this.fleet.hasVehicle(this.vehicle));
});

Then('I should be informed that this vehicle has already been registered into my fleet', function() {
	assert(this.already_registered);
});

Then('the known location of my vehicle should verify this location', function() {
	assert(this.vehicle.location.equals(this.location));
});

Then('I should be informed that my vehicle is already parked at this location', function() {
	assert(this.already_there);
});




