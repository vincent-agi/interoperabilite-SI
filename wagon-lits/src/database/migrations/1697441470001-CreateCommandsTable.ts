import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommandsTable1697441470001 implements MigrationInterface {
    name = 'CreateCommandsTable1697441470001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "commands" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderNumber" character varying(50) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "date" TIMESTAMP NOT NULL,
                "department" character varying(100) NOT NULL,
                "priority" character varying(20) NOT NULL,
                "materials" jsonb NOT NULL,
                "status" character varying(20) NOT NULL DEFAULT 'NEW',
                "lastUpdateAt" TIMESTAMP,
                "updates" jsonb,
                "estimatedDelivery" TIMESTAMP,
                CONSTRAINT "UQ_commands_orderNumber" UNIQUE ("orderNumber"),
                CONSTRAINT "PK_commands" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "commands"`);
    }
}