import pg from 'pg';
import { Sequelize } from "sequelize";

const user = "postgres";
const password = "password";
const port = 5432;
const newDatabase = "state_registration_deadlines";

export const sequelize = new Sequelize(`postgres://${user}:${password}@localhost:${port}/${newDatabase}`, {
    dialect: 'postgres',
    dialectModule: pg
});
