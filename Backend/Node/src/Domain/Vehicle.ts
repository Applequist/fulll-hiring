import Location from "./Location.js";

export type VehicleId = string; // license plate number

/**
 * A generic vehicle.
 *
 * We assume a vehicle is uniquely identified by its license plate and that 
 * identification last for as long as the vehicle is in our system.
 */
export class Vehicle {
    id: VehicleId;
    version: number;
    location: Location;

    /**
     * Create a new vehicle object. 
     * Should not be used by users: use VehicleRepository#create or VehicleRepository#load instead.
     * 
     * @param id The vehicle id, eg its license plate number
     * @param version The version number
     * @param location The vehicle location.
     */
    constructor(id: VehicleId, version: number = 0, location = new Location({ lon: 0, lat: 0 })) {
        this.id = id;
        this.version = version;
        this.location = location;
    }

    parkAt(location: Location): boolean {
        const move_there = !this.location.equals(location);
        if (move_there) {
            this.location = location;
        }
        return move_there;
    }

}

export interface VehicleRepository {
    /**
     * 
     * @param id The new vehicle id.
     * @param lon The new vehicle current longitude in decimal degrees.
     * @param lat The new vehicle current latitude in decimal degrees.
     * 
     * @returns A Promise that resolves to a Vehicle if the creation is successfull, 
     *          or that rejects with an Error otherwise 
     */
    create(id: VehicleId, lon: number, lat: number): Promise<Vehicle>;

    /**
     * Save a Vehicle that has been created or loaded by a repository before being eventually modified. 
     * If the method succeeds the given Vehicle and the corresponding data in the repository are guaranteed to be in sync.
     * 
     * @param vehicle the Vehicle to save.
     * 
     * @returns A Promise that resolves to nothing if the method succeeds,
     *          or rejects with an Error otherwise
     */
    save(vehicle: Vehicle): Promise<void>;
    load(id: VehicleId): Promise<Vehicle | undefined>;
    delete(id: VehicleId): Promise<void>;
    deleteAll(): Promise<void>;
}
