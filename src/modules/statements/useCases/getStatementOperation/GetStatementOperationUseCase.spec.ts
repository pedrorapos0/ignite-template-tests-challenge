import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be to able get statment operation", async () => {
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

    const statement = await inMemoryStatementsRepository.create({
      user_id,
      amount: 500,
      description: "statement description",
      type: OperationType.DEPOSIT,
    });

    const statement_id = statement.id as string;

    const operationStatement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(operationStatement.id).toBe(statement_id);
  });
});

it("Should not  be to able get statment operation for non-existing user", async () => {
  expect(async () => {
    await getStatementOperationUseCase.execute({
      user_id: "non-existing-user_id",
      statement_id: "non-existing-statement_id",
    });
  }).rejects.toBeInstanceOf(AppError);
});

it("Should not  be to able get statment operation for non-existing statement", async () => {
  expect(async () => {
    await getStatementOperationUseCase.execute({
      user_id: "non-existing-user_id",
      statement_id: "non-existing-statement_id",
    });
  }).rejects.toBeInstanceOf(AppError);
});
