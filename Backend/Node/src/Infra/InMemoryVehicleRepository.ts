import { Vehicle, type VehicleId, type VehicleRepository } from "../Domain/Vehicle.js";
import Location from "../Domain/Location.js";

export default class InMemoryVehicleRepository implements VehicleRepository {
    private vehicles: Vehicle[] = [];

    create(id: VehicleId, lon: number = 0.0, lat: number = 0.0): Promise<Vehicle> {
        const current = this.vehicles.find((v) => v.id == id);
        if (current) {
            throw new Error("Vehicle already exists");
        } else {
            const created = new Vehicle(id, 1, new Location({lon, lat}));
            this.vehicles.push(created);
            return Promise.resolve(created);
        }
    }

    save(vehicle: Vehicle): Promise<void> {
        return this.load(vehicle.id).then((current) => {
            if (current == undefined) {
                throw new Error("Unknown Vehicle");
            } else if (current && current.version != vehicle.version) {
                throw new Error("Concurrent Modification Exception");
            } else {
                vehicle.version += 1;
                current.version += 1;
                current.location = vehicle.location;
            }
        });
    }

    load(vehicleId: VehicleId): Promise<Vehicle | undefined> {
        const current = this.vehicles.find((v) => v.id == vehicleId);
        return Promise.resolve(current);
    }

    delete(id: VehicleId): Promise<void> {
        this.vehicles = this.vehicles.filter((v) => v.id != id);
        return Promise.resolve();
    }

    deleteAll(): Promise<void> {
        this.vehicles = [];
        return Promise.resolve();
    }
}

