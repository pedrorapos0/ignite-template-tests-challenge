import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

import { AppError } from "../../../../shared/errors/AppError";

let inMemoryusersRepository: InMemoryUsersRepository;
let createUserCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    inMemoryusersRepository = new InMemoryUsersRepository();
    createUserCase = new CreateUserUseCase(inMemoryusersRepository);
  });

  it("Shoudl be to able create a new user", async () => {
    const request = {
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    };
    await createUserCase.execute({
      name: request.name,
      email: request.email,
      password: request.password,
    });
    const user = await inMemoryusersRepository.findByEmail(request.email);
    expect(user).toHaveProperty('id');
  });

  it("Shoudl not be to able create a new user with same email", async () => {
    expect(async() => {
      const request = {
        name: "User Test",
        email: "test@mail.com",
        password: "123456",
      };
      await createUserCase.execute({
        name: request.name,
        email: request.email,
        password: request.password,
      });

      await createUserCase.execute({
        name: 'User Test1',
        email: request.email,
        password: 'teste123',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

});
