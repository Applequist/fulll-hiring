import { Vehicle, type VehicleId, type VehicleRepository } from "../Domain/Vehicle.js";
import Location from "../Domain/Location.js";

export default class InMemoryVehicleRepository implements VehicleRepository {
    private vehicles: Vehicle[] = [];

    create(id: VehicleId, lon: number = 0.0, lat: number = 0.0): Promise<Vehicle> {
        return new Promise((resolve, reject) => {
            const current = this.vehicles.find((v) => v.id == id);
            if (current) {
                reject(new Error(`A Vehicle(id = ${id}) already exists.`));
            } else {
                const created = new Vehicle(id, 1, new Location({ lon, lat }));
                this.vehicles.push(created);
                resolve(created);
            }
        });
    }

    save(vehicle: Vehicle): Promise<void> {
        return this.load(vehicle.id).then((current) => {
            if (current.version != vehicle.version) {
                throw new Error(`Concurrent Modification Exception: Vehicle(id = ${vehicle.id}, version = ${vehicle.version}) is outdated.`);
            } else {
                vehicle.version += 1;
                current.version = vehicle.version;
                current.location = vehicle.location;
            }
        });
    }

    load(vehicleId: VehicleId): Promise<Vehicle> {
        return new Promise((resolve, reject) => {
            const current = this.vehicles.find((v) => v.id == vehicleId);
            if (current) {
                resolve(current);
            } else {
                reject(new Error(`Unknown Vehicle(id = ${vehicleId})`));
            }
        });
    }

    delete(id: VehicleId): Promise<void> {
        return new Promise((resolve, reject) => {
            // TODO check if the vehicle exists and is registered
            this.vehicles = this.vehicles.filter((v) => v.id != id);
            resolve();
        });
    }

    deleteAll(): Promise<void> {
        return new Promise((resolve) => {
            // TODO check if any vehicles is registered.
            this.vehicles = [];
            resolve();
        });
    }
}

