import { type UserId, Fleet, type FleetId, type FleetRepository } from "../Domain/Fleet.js"
import { QueryTypes, Sequelize } from 'sequelize'
import { VehicleId } from "../Domain/Vehicle.js";

export default class SqlFleetRepository implements FleetRepository {
    constructor(private sql: Sequelize) {}

    create(ownerId: UserId): Promise<Fleet> {
        return this.sql.query('INSERT INTO fleets (version, owner_id) VALUES (1, :owner_id) RETURNING id',
        {
            replacements: {
                owner_id: ownerId
            },
            type: QueryTypes.INSERT
        }).then((results: any[])  => {
            return new Fleet(ownerId, [], results[0][0].id, 1);
        });
    }

    save(fleet: Fleet): Promise<void> {
        return this.sql.transaction().then(async (tx) => {
            try {
                const [_, update_count] = await this.sql.query('UPDATE fleets SET (owner_id, version) = (:owner_id, version + 1) WHERE id = :id AND version = :version', {
                    replacements: { owner_id: fleet.ownerId, id: fleet.id, version: fleet.version },
                    type: QueryTypes.UPDATE
                });
                if (update_count > 0) {
                    // merge fleet-vehicles relation
                    const rels = fleet.vehicles.map((vid) => `(${fleet.id}, '${vid}')`).join(',');
                    const query ='MERGE INTO fleet_vehicles f ' +
                                 `USING (VALUES${rels}) AS v (fleet_id, vehicle_id) ` +
                                 'ON f.fleet_id = v.fleet_id ' +
                                 'WHEN NOT MATCHED THEN INSERT (fleet_id, vehicle_id) VALUES (v.fleet_id, v.vehicle_id) ' +
                                 'WHEN NOT MATCHED BY SOURCE THEN DELETE';
                    await this.sql.query(query,
                    {
                        replacements: {
                            rels
                        }
                    });
                }
                await tx.commit();
            } catch (e) {
                await tx.rollback();
            }
        });
    }

    load(fleetId: FleetId): Promise<Fleet | undefined> {
        return this.sql.query('SELECT * FROM fleets as f LEFT JOIN fleet_vehicles as fv ON f.id = fv.fleet_id WHERE f.id = :id', {
            replacements: { id: fleetId },
            type: QueryTypes.SELECT
        }).then((results: any[]) => {
            const vehicles = results.filter((e) => e.vehicle_id != undefined);
            const vehicle_ids = vehicles.map((v) => v.vehicle_id);
            const fleet = new Fleet(results[0].owner_id, vehicle_ids, fleetId, results[0].version);
            return fleet;
        });
    }

    delete(id: FleetId): Promise<void> {
        return this.sql.query('DELETE FROM fleets WHERE id = :id',
        {
            replacements: {
                id
            },
            type: QueryTypes.DELETE
        }).then((r) => console.log(r));
    }

    deleteAll(): Promise<void> {
        return this.sql.query('DELETE FROM fleets;').then(() => console.log("Delete All Fleets."));
    }
}

