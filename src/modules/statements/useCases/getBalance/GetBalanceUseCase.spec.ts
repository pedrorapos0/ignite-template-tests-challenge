import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be to able get balance from a user", async () => {
    enum OperationType {
      DEPOSIT = "deposit",
      WITHDRAW = "withdraw",
    }

    await inMemoryUsersRepository.create({
      name: "User Test",
      email: "test@mail.com",
      password: "123456",
    });

    const user = await inMemoryUsersRepository.findByEmail("test@mail.com");

    const user_id = user?.id as string;

    await inMemoryStatementsRepository.create({
      user_id,
      amount: 500,
      description: "statement description",
      type: OperationType.DEPOSIT,
    });

    await inMemoryStatementsRepository.create({
      user_id,
      amount: 100,
      description: "statement description",
      type: OperationType.WITHDRAW,
    });

    const { balance, statement } = await getBalanceUseCase.execute({ user_id });

    expect(balance).toBe(400);
    expect(statement.length).toBe(2);
  });

  it("Should not be to able get balance from a non-existing user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existing-id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
