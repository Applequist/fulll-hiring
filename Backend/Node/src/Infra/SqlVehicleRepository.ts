import Location from '../Domain/Location.js';
import { Vehicle, type VehicleId, type VehicleRepository } from '../Domain/Vehicle.js'
import { QueryTypes, Sequelize } from 'sequelize';

export default class SqlVehicleRepository implements VehicleRepository {
    constructor(private sql: Sequelize) { }

    create(id: VehicleId, lon: number = 0.0, lat: number = 0.0): Promise<Vehicle> {
        return this.sql.query('INSERT INTO vehicles (id, version, lon, lat) VALUES (:id, 1, :lon, :lat);',
            {
                replacements: {
                    id,
                    lon,
                    lat
                },
                type: QueryTypes.RAW,
                logging: false
            }).then((_) => {
                return new Vehicle(id, 1, new Location({ lon, lat }));
            });
    }

    save(vehicle: Vehicle): Promise<void> {
        return this.sql.query('UPDATE vehicles SET (version, lon, lat) = (version + 1, :lon, :lat) WHERE id = :id and version = :version;',
            {
                replacements: {
                    id: vehicle.id,
                    version: vehicle.version,
                    lon: vehicle.location.lon,
                    lat: vehicle.location.lat
                },
                type: QueryTypes.UPDATE,
                logging: false
            }).then(([_, update_count]) => {
                if (update_count == 0) {
                    throw new Error(`Unknown Vehicle(id = ${vehicle.id})`);
                } else {
                    vehicle.version += 1;
                }
            });
    }

    load(id: VehicleId): Promise<Vehicle> {
        return this.sql.query('SELECT * FROM vehicles WHERE id = :id',
            {
                replacements: {
                    id
                },
                type: QueryTypes.SELECT,
                logging: false
            }).then((results: any[]) => {
                if (results.length == 1) {
                    return new Vehicle(results[0].id, results[0].version, new Location(results[0]));
                } else {
                    // PrimaryKey constraint guarantees their is 0 or 1 vehicle with the given id.
                    throw new Error(`Unknown Vehicle(id = ${id})`);
                }
            });
    }

    delete(id: VehicleId): Promise<void> {
        return this.sql.query('DELETE FROM vehicles WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE,
                logging: false
            });
    }

    deleteAll(): Promise<void> {
        return this.sql.query('DELETE FROM vehicles;', { type: QueryTypes.DELETE, logging: false });
    }
}

