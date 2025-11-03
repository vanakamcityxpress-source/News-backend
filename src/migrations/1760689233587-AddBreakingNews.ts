import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddBreakingNews1760689233587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "breaking_news",
                columns: [
                    {
                        name: "id",
                        type: "serial",   // serial handles auto-increment
                        isPrimary: true,
                    },
                    {
                        name: "video",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "heading",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "NOW()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "NOW()",
                    },
                ],
            }),
            true // ifNotExist
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("breaking_news");
    }
}
