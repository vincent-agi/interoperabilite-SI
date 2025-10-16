import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWagonLitsLogsTable1697441452001 implements MigrationInterface {
    name = 'CreateWagonLitsLogsTable1697441452001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wagon_lits_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "level" character varying(10) NOT NULL,
                "context" character varying(100) NOT NULL,
                "message" text NOT NULL,
                "trace" text,
                "metadata" jsonb,
                "service" character varying(50) NOT NULL DEFAULT 'wagon-lits',
                CONSTRAINT "PK_wagon_lits_logs" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "wagon_lits_logs"`);
    }
}