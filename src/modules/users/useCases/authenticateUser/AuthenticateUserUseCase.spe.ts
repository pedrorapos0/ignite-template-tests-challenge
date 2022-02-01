import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authAuthenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryusersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryusersRepository = new InMemoryUsersRepository();
    authAuthenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryusersRepository
    );
  });

  it("Should be to able authenticate a user", async () => {
    const passwordHash = await hash("123456", 8);
    await inMemoryusersRepository.create({
      name: "User Test",
      email: "test@mail.com",
      password: passwordHash,
    });

    const response = await authAuthenticateUserUseCase.execute({
      email: "test@mail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
  });

  it("Should not be to able authenticate a user with incorrect email", async () => {
    expect(async () => {
      const passwordHash = await hash("123456", 8);
      await inMemoryusersRepository.create({
        name: "User Test",
        email: "test@mail.com",
        password: passwordHash,
      });

      await authAuthenticateUserUseCase.execute({
        email: "wrongmail@mail.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be to able authenticate a user with incorrect password", async () => {
    expect(async () => {
      const passwordHash = await hash("123456", 8);
      await inMemoryusersRepository.create({
        name: "User Test",
        email: "test@mail.com",
        password: passwordHash,
      });

      await authAuthenticateUserUseCase.execute({
        email: "test@mail.com",
        password: "wrongpassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

});
