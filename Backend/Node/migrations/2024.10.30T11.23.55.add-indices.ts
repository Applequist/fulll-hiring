import { Sequelize } from 'sequelize';
import type { Migration } from '../umzug.ts';

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().addIndex('vehicles', { fields: ['id'] });
    await sequelize.getQueryInterface().addIndex('fleets', { fields: ['id'] });
};

export const down: Migration = async ({ context: sequelize }) => {
    sequelize.getQueryInterface().removeIndex('fleets', ['id']);
    sequelize.getQueryInterface().removeIndex('vehicles', ['id']);
};
