import Location from "./Location.js";

export type VehicleId = string; // license plate number

/**
 * A generic vehicle.
 *
 * We assume a vehicle is uniquely identified by its license plate and that 
 * identitification last for as long as the vehicle is in our system.
 */
export class Vehicle {
    id: VehicleId;
    version: number;
    location: Location;

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
    create(id: VehicleId, lon: number, lat: number): Promise<Vehicle>;
    save(vehicle: Vehicle): Promise<void>;
    load(id: VehicleId): Promise<Vehicle | undefined>;
    delete(id: VehicleId): Promise<void>;
    deleteAll(): Promise<void>;
}
