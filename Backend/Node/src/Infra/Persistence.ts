import { Sequelize } from "sequelize";
import { FleetRepository } from "../Domain/Fleet.js";
import { VehicleRepository } from "../Domain/Vehicle.js";
import InMemoryFleetRepository from "./InMemoryFleetRepository.js";
import InMemoryVehicleRepository from "./InMemoryVehicleRepository.js";
import SqlVehicleRepository from "./SqlVehicleRepository.js";
import SqlFleetRepository from "./SqlFleetRepository.js";


export type DbConfig = {
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
};

export const POSTGRES: DbConfig = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.DB_PWD || 'mysecretpasswords',
    database: 'fleetdb'
};

export type PersistenceConfig = "memory" | DbConfig;

export type Persistence = {
    close: () => Promise<void>,
    Vehicles: VehicleRepository,
    Fleets: FleetRepository
};

export function configure(db: PersistenceConfig): Persistence {
    if (db == "memory") {
        return {
            close: () => { return Promise.resolve() },
            Vehicles: new InMemoryVehicleRepository(),
            Fleets: new InMemoryFleetRepository()
        };
    } else {
        const sequelize = new Sequelize({
            host: db.host,
            port: db.port,
            username: db.username,
            password: db.password,
            database: db.database,
            dialect: 'postgres',
            // logging: (...msg) => console.log(msg),
            pool: {
                min: 1,
                max: 9
            }
        });
        return {
            close: () => { return sequelize.close() },
            Vehicles: new SqlVehicleRepository(sequelize),
            Fleets: new SqlFleetRepository(sequelize)
        };
    }
}
