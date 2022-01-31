import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be to able create a statement for user", async () => {
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

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "statement description",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be to able create a statement for non-existing user", async () => {
    expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }

      await inMemoryUsersRepository.create({
        name: "User Test",
        email: "test@mail.com",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: "non-existing-id",
        amount: 100,
        description: "statement description",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});

it("Should not be to able create a statement withdraw without insufficient balance", async () => {
  expect(async () => {
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

    await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "statement description",
      type: OperationType.DEPOSIT,
    });

    await createStatementUseCase.execute({
      user_id,
      amount: 200,
      description: "statement description",
      type: OperationType.WITHDRAW,
    });

  }).rejects.toBeInstanceOf(AppError);
});
