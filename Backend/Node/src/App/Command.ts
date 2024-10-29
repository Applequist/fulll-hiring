import { Fleet, FleetId, UserId } from "../Domain/Fleet.js"
import Location from "../Domain/Location.js";
import { Vehicle, VehicleId } from "../Domain/Vehicle.js";
import { Persistence } from "../Infra/Persistence.js";

/**
 * Create a new fleet.
 *
 * @param persistence {Persistence} the persistence context.
 * @param userId {UserId} the user id of the fleet's owner
 */
export const createFleet = async (persistence: Persistence, userId: UserId): Promise<Fleet> => {
    return persistence.Fleets.create(userId);
}

const createOrLoadVehicle = async (persistence: Persistence, vehicleId: VehicleId): Promise<Vehicle> => {
    try {
        const v = await persistence.Vehicles.create(vehicleId, 0.0, 0.0);
        return v;
    } catch (e) { // unique key constraint violation
        const v = await persistence.Vehicles.load(vehicleId);
        return v;
    }
}

export const registerVehicle = async (persistence: Persistence, fleetId: FleetId, vehicleId: VehicleId): Promise<Fleet> => {
    const f = await persistence.Fleets.load(fleetId);
    if (f == undefined) {
        throw new Error(`Fleet(id = ${fleetId} not found`);
    }
    const v = await createOrLoadVehicle(persistence, vehicleId);
    if (f.registerVehicle(v.id)) {
        await persistence.Fleets.save(f);
    }
    return f;
}

export const unregisterVehicle = async (persistence: Persistence, fleetId: FleetId, vehicleId: VehicleId): Promise<Fleet> => {
    const f = await persistence.Fleets.load(fleetId);
    if (f == undefined) {
        throw new Error(`Fleet(id = ${fleetId} not found`);
    }
    f.vehicles = f.vehicles.filter((vid) => vid != vehicleId);
    await persistence.Fleets.save(f);
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
