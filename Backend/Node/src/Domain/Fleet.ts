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
    /**
     * Create a new Fleet owned by the given user.
     * 
     * @param ownerId The id of the fleet owner/manager.
     * @returns A Promise that resolves to the new Fleet if successful,
     *          or rejects with an Error otherwise.
     */
    create(ownerId: UserId): Promise<Fleet>;

    /**
     * Save a Fleet that has been created or loaded by the repository and eventually modified.
     * If the method succeeds, the data in the repository is guaranteed to be in sync with the 
     * fleet (including the incremented version number)
     * 
     * @param fleet A Fleet to save.
     * @returns A Promise that resolves to nothing if the method succeeds, or 
     *          rejects with an Error otherwise.
     */
    save(fleet: Fleet): Promise<void>;

    /**
     * Load the Fleet with the given id *and* its registerd vehicle ids.
     * @param id A Fleet id.
     * @returns A Promise that resolves to the Fleet if the fleet exists and the load is successful,
     *          or rejects with an Error otherwise.
     */
    load(id: FleetId): Promise<Fleet>;

    /**
     * Delete a Fleet.
     * @param id A Fleet id
     * @returns A Promise that resolves to nothing if successful, or rejects with an Error otherwise.
     */
    delete(id: FleetId): Promise<void>;

    /**
     * Delete all Fleets.
     * @returns A Promise that resolves to nothing if successful, or rejects with an Error otherwise.
     */
    deleteAll(): Promise<void>;
}

