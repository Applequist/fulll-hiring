import { Umzug, SequelizeStorage } from 'umzug'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('fleetdb', 'postgres', 'mysecretpassword', {
    host: 'localhost',
    dialect: 'postgres'
});

export const migrator = new Umzug({
    migrations: {
        glob: ['migrations/*.ts', { cwd: __dirname }],
    },
    context: sequelize,
    storage: new SequelizeStorage({
        sequelize,
    }),
    logger: console,
});

export type Migration = typeof migrator._types.migration;

