import mysqlServer from "../config/mysql";
import { sign } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../jwt";

import { CreateResult, MyContext, UserInfo, ValueInterface } from "../types/types";
import { RowDataPacket } from "mysql2";

import { QueryError } from "mysql2";

/**
 * Retrieves the values from a specific column for a given user.
 * @param {string} column_name - The name of the column.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<object>} - A promise that resolves to an object representing the retrieved values from the column.
 */
const selectColumnValue = async (column_name: string, user_id: string): Promise<RowDataPacket> => {
  try {
    const [rows] = await mysqlServer.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE id = ?`,
      user_id
    );
    return rows[0][column_name];
  } catch (err) {
    throw new Error(`Failed to retrieve values from users: ${(err as QueryError).code}`);
  }
};

export const resolvers = {
  Query: {
    /**
     * Inserts a new user into the database and retrieves the inserted or already existent user's details.
     * @param {unknown} _ - Placeholder parameter.
     * @param {unknown} __ - Placeholder parameter.
     * @param {object} context - The context object containing request, response, and user details.
     * @returns {Promise<User>} - A promise that resolves to an object representing the inserted user's details.
     * @throws {Error} - Throws an error if an error occurs during the user insertion process.
     */
    user: async (_: unknown, __: unknown, { user }: { user: UserInfo }): Promise<RowDataPacket> => {
      const { uid, displayName, email } = user;
      try {
        await mysqlServer.query(
          `INSERT INTO users(id, name, email, emergency_card, bpm_card, 
          communication_card, event_card, medicine_card, professional_card, exercise_card) 
          VALUES(?, ?, ?, "[]", "[]", "[]", "[]", "[]", "[]", "[]")`,
          [uid, displayName, email]
        );
      } catch (_) {
        throw new Error("Occurred an error in retrieving user data");
      } finally {
        const [rows] = await mysqlServer.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE id = ?",
          uid
        );
        return rows[0];
      }
    },

    /**
     * Authenticates a user by signing their user object and storing the access token in a cookie ("accessToken").
     * @param _ - Placeholder parameter.
     * @param {object} user - The user object containing properties such as uid, displayName, and email.
     * @param {object} res - The response object used to set the cookie.
     * @returns {Boolean} - Returns true if the access token is created and saved in the cookie successfully, false otherwise.
     */
    authenticate: (_: unknown, { user }: { user: UserInfo }, { res }: MyContext): Boolean => {
      try {
        const accessToken = sign({ data: user }, JWT_SECRET_KEY);

        const day = 60 * 60 * 24 * 1000;
        const month = 60 * 60 * 24 * 30 * 1000;

        res.cookie("accessToken", accessToken, {
          maxAge: day,
          sameSite: "none",
          httpOnly: true,
          secure: true,
        });

        return true;
      } catch (err) {
        throw new Error((err as Error).message);
      }
    },

    logUserOut: (_: unknown, __: unknown, { res }: MyContext) => {
      try {
        res.clearCookie("accessToken", {
          sameSite: "none",
          httpOnly: true,
          secure: true,
        });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Mutation: {
    createColumnValue: async (
      _: unknown,
      { value }: { value: ValueInterface }
    ): Promise<CreateResult> => {
      const { column_name, item, user_id } = value;

      // @ts-ignore
      const itemToAdd = item[column_name];

      try {
        const existingList = await selectColumnValue(column_name, user_id);

        if (existingList.length >= 10) {
          return { limit_reached: true };
        }
        existingList.push(itemToAdd);

        await mysqlServer.query(`UPDATE users SET ${column_name} = ? WHERE id = ?`, [
          JSON.stringify(existingList),
          user_id,
        ]);
        return { created: true };
      } catch (_) {
        return { error: true };
      }
    },
  },
};
