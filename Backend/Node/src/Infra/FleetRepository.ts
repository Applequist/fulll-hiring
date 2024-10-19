import User from '../Domain/User.js';
import Fleet from '../Domain/Fleet.js';
import Vehicle from '../Domain/Vehicle.js';

interface FleetRepository {
	/**
	* Create a new empty Fleet.
	*/
	createFleet(owner: User, name: string): Fleet;


	/**
	* Add a vehicle to a fleet. 
	* Return `true` if the vehicle was added to the fleet,
	* `false` otherwise (if the vehicle was already registerd for instance).
	*/
	addVehicle(fleet: Fleet, vehicle: Vehicle): boolean;



}

