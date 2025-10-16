import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1697441470000 implements MigrationInterface {
    name = 'CreateOrdersTable1697441470000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderNumber" character varying(50) NOT NULL,
                "receivedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "date" TIMESTAMP NOT NULL,
                "department" character varying(100) NOT NULL,
                "priority" character varying(20) NOT NULL,
                "materials" jsonb NOT NULL,
                "status" character varying(20) NOT NULL DEFAULT 'PENDING',
                "processedAt" TIMESTAMP,
                CONSTRAINT "UQ_orders_orderNumber" UNIQUE ("orderNumber"),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
    }
}