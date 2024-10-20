import { UserId } from "./User.js";
import { VehicleId } from "./Vehicle.js";

export type FleetId = number;

export class Fleet {
    id: FleetId;
    version: number;
    ownerId: UserId;
    vehicles: VehicleId[]; // use immutable collection?

    constructor(id: FleetId, version: number, ownerId: UserId, vehicles: VehicleId[] = []) {
        this.id = id;
        this.version = version;
        this.ownerId = ownerId;
        this.vehicles = vehicles;
    }

    isVehicleRegistered(vehicleId: VehicleId): boolean {
        return this.vehicles.some((vid) => vid == vehicleId);
    }

    registerVehicle(vehicleId: VehicleId) {
        const register_vehicle = !this.isVehicleRegistered(vehicleId);
        if (register_vehicle) {
            this.vehicles.push(vehicleId);
        }
        return register_vehicle;
    }
};

/**
 * A simple Fleet repository to save and fetch Fleets.
 */
export interface FleetRepository {
    save(fleet: Fleet): Promise<void>;
    load(fleetId: FleetId): Promise<Fleet | undefined>;
}
