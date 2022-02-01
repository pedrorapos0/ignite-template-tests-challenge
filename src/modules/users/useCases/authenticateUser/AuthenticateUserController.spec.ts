import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controler", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be to able authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@mail.com",
      password: "123456",
    });

    const { body } = response;
    expect(body).toHaveProperty("token");
  });
});
