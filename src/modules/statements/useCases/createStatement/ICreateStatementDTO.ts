import { Statement } from "../../entities/Statement";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}
export interface ICreateStatementDTO {
  user_id: string;
  description: string;
  sender_id?: string;
  userDestionation_id?: string;
  amount: number;
  type: OperationType

}

