import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDevMaterielsLogsTable1697441452000 implements MigrationInterface {
    name = 'CreateDevMaterielsLogsTable1697441452000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "dev_materiels_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "level" character varying(10) NOT NULL,
                "context" character varying(100) NOT NULL,
                "message" text NOT NULL,
                "trace" text,
                "metadata" jsonb,
                "service" character varying(50) NOT NULL DEFAULT 'dev-materiels',
                CONSTRAINT "PK_dev_materiels_logs" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dev_materiels_logs"`);
    }
}