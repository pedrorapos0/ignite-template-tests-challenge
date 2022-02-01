import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get Statement operation Controler", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be to able get statement operantion", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });

    const responseAuthenticate = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "test@mail.com",
        password: "123456",
      });

    const { token } = responseAuthenticate.body;

    const responseStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = responseStatement.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it("Should not be to able get balance without authenticate", async () => {
    const id = "non-existing-id";
    const response = await request(app).get(`/api/v1/statements/${id}`);

    expect(response.status).toBe(401);
  });
});
