import { VehicleId } from "./Vehicle.js";

export type UserId = string;
export type FleetId = number;

export class Fleet {
    id: FleetId;
    version: number;
    ownerId: UserId;
    vehicles: VehicleId[]; // use immutable collection?

    constructor(ownerId: UserId, vehicles: VehicleId[] = [], id: FleetId = 0, version: number = 0) {
        this.ownerId = ownerId;
        this.vehicles = vehicles;
        this.id = id;
        this.version = version;
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
    create(ownerId: UserId): Promise<Fleet>;
    save(fleet: Fleet): Promise<void>;
    load(id: FleetId): Promise<Fleet | undefined>;
    delete(id: FleetId): Promise<void>;
    deleteAll(): Promise<void>;
}

