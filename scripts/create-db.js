const { Client } = require("pg");
const fs = require("fs");
const csv = require("csv-parser");
const { Sequelize, DataTypes } = require("sequelize");

// Update these values with your PostgreSQL credentials
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = "localhost";
const port = process.env.POSTGRES_PORT;
const newDatabase = "state_registration_deadlines";

// Connect to the default 'postgres' database
const client = new Client({
    user,
    host,
    database: "postgres",
    password,
    port,
});

async function createDatabase() {
    try {
        await client.connect();
        await client.query(`CREATE DATABASE ${newDatabase};`);
        console.log(`Database "${newDatabase}" created successfully.`);
    } catch (err) {
        if (err.code === "42P04") {
            console.log(`Database "${newDatabase}" already exists.`);
        } else {
            console.error("Error creating database:", err);
        }
    } finally {
        await client.end();
    }
}

const sequelize = new Sequelize(
    `postgres://${user}:${password}@localhost:${port}/${newDatabase}`
);

const VoterRegistrationDeadline = sequelize.define(
    "VoterRegistrationDeadline",
    {
        State: { type: DataTypes.STRING, primaryKey: true },
        DeadlineInPerson: DataTypes.STRING,
        DeadlineByMail: DataTypes.STRING,
        DeadlineOnline: DataTypes.STRING,
        ElectionDayRegistration: DataTypes.STRING,
        OnlineRegistrationLink: DataTypes.STRING,
        Description: DataTypes.STRING,
    },
    {
        tableName: "voter_registration_deadlines",
        timestamps: false,
    }
);

async function importCSV() {
    await sequelize.authenticate();
    await VoterRegistrationDeadline.sync();

    const records = [];
    fs.createReadStream("voter_registration_deadlines.csv")
        .pipe(csv())
        .on("data", (row) => {
            records.push({
                State: row["State"],
                DeadlineInPerson: row["Registration Deadline In-Person"],
                DeadlineByMail: row["Registration Deadline By Mail"],
                DeadlineOnline: row["Registration Deadline Online"],
                ElectionDayRegistration: row["Election Day Registration"],
                OnlineRegistrationLink: row["Online Registration Link"],
                Description: row["Description"],
            });
        })
        .on("end", async () => {
            for (const record of records) {
                await VoterRegistrationDeadline.upsert(record);
            }
            console.log("Data imported successfully.");
            await sequelize.close();
        });
}

// First create the database, then import the CSV
createDatabase().then(importCSV).catch((err) => {
    console.error("Error:", err);
});