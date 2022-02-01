import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Show Profile User Controler", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be to able show profile from user", async () => {
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

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { body } = response;
    expect(body).toHaveProperty("id");
  });

  it("Should not be to able show profile from user without authentication", async () => {
    const response = await request(app).get("/api/v1/profile");

    expect(response.status).toBe(401);
  });
});
