import pg from 'pg';
import { Sequelize } from "sequelize";

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const port = process.env.POSTGRES_PORT;
const newDatabase = "state_registration_deadlines";

export const sequelize = new Sequelize(`postgres://${user}:${password}@localhost:${port}/${newDatabase}`, {
    dialect: 'postgres',
    dialectModule: pg
});
