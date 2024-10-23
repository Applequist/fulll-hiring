import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().createTable('fleet_vehicles',
    {
        fleet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fleets',
                key: 'id'
            },
            onDelete: 'cascade',
        },
        vehicle_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id'
            },
            onDelete: 'restrict',
        }
    });

};

export const down: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().dropTable('fleet_vehicles');
};
