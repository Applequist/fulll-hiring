import { Vehicle, type VehicleId, type VehicleRepository } from "../Domain/Vehicle.js";

export default class InMemoryVehicleRepository implements VehicleRepository {
        private vehicles: Vehicle[] = [];

        save(vehicle: Vehicle): Promise<void> {
                return this.load(vehicle.id).then((current) => {
                        if (current == undefined) {
                                vehicle.version = 1;
                                this.vehicles.push(new Vehicle(vehicle.id, 1, vehicle.location));
                        } else if (current && current.version == vehicle.version) {
                                vehicle.version += 1;
                                current.version += 1;
                                current.location = vehicle.location;
                        } else {
                                throw new Error("Concurrent Modification Exception");
                        }
                });
        }

        load(vehicleId: VehicleId): Promise<Vehicle | undefined> {
                const current = this.vehicles.find((v) => v.id == vehicleId);
                return Promise.resolve(current);
        }
}

