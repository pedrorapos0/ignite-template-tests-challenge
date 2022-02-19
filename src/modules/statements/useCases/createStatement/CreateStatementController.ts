import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    let { id } = request.user;
    const { user_id: userDestionation_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");

    if (userDestionation_id) {
      const splittedPathIndex = splittedPath.findIndex(
        (value) => value === userDestionation_id
      );
      splittedPath.splice(splittedPathIndex);
    }
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);


    const statement = await createStatement.execute({
      user_id: id,
      userDestionation_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
