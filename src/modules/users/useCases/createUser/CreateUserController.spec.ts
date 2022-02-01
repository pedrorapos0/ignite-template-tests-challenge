import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controler", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be to able create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });


    expect(response.status).toBe(201);
  });

  it("Should not be to able create a new user with existing email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "User1 Test1",
      email: "test@mail.com",
      password: "654321",
    });


    expect(response.status).toBe(400);
  });

});
