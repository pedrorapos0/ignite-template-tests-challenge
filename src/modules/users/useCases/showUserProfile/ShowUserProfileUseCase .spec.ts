import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryusersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryusersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryusersRepository
    );
  });

  it("Should be to able show user profile", async () => {
    await inMemoryusersRepository.create({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });

    const user = (await inMemoryusersRepository.findByEmail(
      "test@mail.com"
    )) as User;

    const user_id = user.id as string;

    const userProfileReponse = await showUserProfileUseCase.execute(user_id);

    expect(userProfileReponse).toEqual(user);
  });
});

it("Should not be able to show non-existing user profile", async () => {
  expect(async () => {
    await inMemoryusersRepository.create({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });

    await showUserProfileUseCase.execute("non-existing-id");
  }).rejects.toBeInstanceOf(AppError);
});
