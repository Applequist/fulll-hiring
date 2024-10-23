import { DataTypes } from 'sequelize';
import type { Migration } from '../umzug.ts';

export const up: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().createTable('fleets',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            version: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            owner_id: {
                type: DataTypes.STRING(16),
                allowNull: false
            }
        });
};

export const down: Migration = async ({context: sequelize}) => {
    await sequelize.getQueryInterface().dropTable('fleets');
};
