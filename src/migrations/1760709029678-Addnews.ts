import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Addnews1760709029678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "article",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "author",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "category",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "categoryColor",
                        type: "varchar",
                        isNullable: false,
                        default: "'blue'",
                    },
                    {
                        name: "contentParagraphs",
                        type: "json",
                        isNullable: false,
                        default: "'[]'",
                        comment: "Stores article paragraphs as JSON array",
                    },
                    {
                        name: "contentQuote",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "tags",
                        type: "json",
                        isNullable: false,
                        default: "'[]'",
                        comment: "Stores tags as JSON array",
                    },
                    {
                        name: "mainImage",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "images",
                        type: "json",
                        isNullable: false,
                        default: "'[]'",
                        comment: "Stores multiple images as JSON array",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("article");
    }
}
