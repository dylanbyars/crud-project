import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableSchema1721886658890 implements MigrationInterface {
    name = 'UpdateTableSchema1721886658890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD "authorId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "authorId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "bio" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "bio"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "authorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP COLUMN "authorId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "userId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD "userId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
