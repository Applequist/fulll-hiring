import { Fleet, FleetId, UserId } from "../Domain/Fleet.js"
import Location from "../Domain/Location.js";
import { Vehicle, VehicleId } from "../Domain/Vehicle.js";
import { Persistence } from "../Infra/Persistence.js";

export const createFleet = async (persistence: Persistence, userId: UserId): Promise<Fleet> => {
    return persistence.Fleets.create(userId);
}

// FIXME: we should get a transaction here
const loadOrCreateVehicle = async (persistence: Persistence, vehicleId: VehicleId): Promise<Vehicle> => {
    try {
        const v = await persistence.Vehicles.load(vehicleId);
        return v;
    } catch (e) {
        const v = await persistence.Vehicles.create(vehicleId, 0.0, 0.0);
        return v;
    }
}

export const registerVehicle = async (persistence: Persistence, fleetId: FleetId, vehicleId: VehicleId): Promise<Fleet> => {
    const f = await persistence.Fleets.load(fleetId);
    const v = await loadOrCreateVehicle(persistence, vehicleId);
    if (f?.registerVehicle(v.id)) {
        await persistence.Fleets.save(f);
    }
    return f;
}

export const localizeVehicle = async (persistence: Persistence, fleetId: FleetId, vehicleId: VehicleId, lon: number, lat: number): Promise<Vehicle> => {
    const f = await persistence.Fleets.load(fleetId);
    if (!f.isVehicleRegistered(vehicleId)) {
        throw new Error(`Vehicle(id = ${vehicleId}) is not registered in Fleet(id = ${fleetId})`);
    }
    const v = await persistence.Vehicles.load(vehicleId);
    if (v.parkAt(new Location({ lon, lat }))) {
        await persistence.Vehicles.save(v);
    }
    return v;
}
