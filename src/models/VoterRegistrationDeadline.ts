import { DataTypes } from "sequelize";
import { sequelize } from "../util/db";

export const VoterRegistrationDeadline = sequelize.define(
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

export const fetchAll = async () => {
  return await VoterRegistrationDeadline.findAll();
};

export type Deadline = {
  State: string;
  DeadlineInPerson: string;
  DeadlineByMail: string;
  DeadlineOnline: string;
  ElectionDayRegistration: string;
  OnlineRegistrationLink: string;
  Description: string;
};
