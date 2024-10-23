import { DataTypes } from 'sequelize';
import type { Migration } from '../umzug.ts';

export const up: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().createTable('vehicles',
    {
        id: {
            type: DataTypes.STRING(12),
            allowNull: false,
            primaryKey: true,
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lon: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    });
};

export const down: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().dropTable('vehicles');
};
