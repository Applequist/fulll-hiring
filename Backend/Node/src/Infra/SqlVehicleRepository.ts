import Location from '../Domain/Location.js';
import { Vehicle, type VehicleId, type VehicleRepository } from '../Domain/Vehicle.js'
import { QueryTypes, Sequelize } from 'sequelize';

export default class SqlVehicleRepository implements VehicleRepository {
    constructor(private sql: Sequelize) { }

    create(id: VehicleId, lon: number = 0.0, lat: number = 0.0): Promise<Vehicle> {
        return this.sql.query('INSERT INTO vehicles (id, version, lon, lat) VALUES (:id, 1, :lon, :lat) RETURNING id;',
            {
                replacements: {
                    id,
                    lon,
                    lat
                },
                type: QueryTypes.INSERT
            }).then((results: any[]) => {
                console.log("Create Vehicle: ", results);
                return new Vehicle(id, 1, new Location({ lon, lat }));
            });
    }

    async save(vehicle: Vehicle): Promise<void> {
        console.log("Saving vehicle...");
        const [_, update_count] = await this.sql.query('UPDATE vehicles SET (version, lon, lat) = (version + 1, :lon, :lat) WHERE id = :id and version = :version;',
            {
                replacements: {
                    id: vehicle.id,
                    version: vehicle.version,
                    lon: vehicle.location.lon,
                    lat: vehicle.location.lat
                },
                type: QueryTypes.UPDATE
            });
        if (update_count > 0) {
            vehicle.version += 1;
        }
    }

    load(id: VehicleId): Promise<Vehicle | undefined> {
        return this.sql.query('SELECT * FROM vehicles WHERE id = :id',
            {
                replacements: {
                    id
                },
                type: QueryTypes.SELECT
            }).then((results: any[]) => new Vehicle(results[0].id, results[0].version, new Location(results[0])));
    }

    delete(id: VehicleId): Promise<void> {
        return this.sql.query('DELETE FROM vehicles WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }).then((r) => console.log(r));
    }

    deleteAll(): Promise<void> {
        return this.sql.query('DELETE FROM vehicles;').then(([results, meta]) => console.log("Deleted all vehicles"));
    }
}

