import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export default class AddFieldUserSendInStatements1645296051839
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      "statements",
      new TableForeignKey({
        name: "user_sender",
        columnNames: ["sender_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("statements", "user_sender");
    await queryRunner.dropColumn('statements','sender_id' );
  }
}
