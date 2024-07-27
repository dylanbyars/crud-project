/*
import { MigrationInterface, QueryRunner } from 'typeorm'

// NOTE: first I cleared out my `user` and `post` db so that I could just modify the existing tables without having to clean up the duplicate emails in all the test users I've made so far.

export class UpdateUserTable1722055681076 implements MigrationInterface {
  name = 'UpdateUserTable1722055681076'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"
        `)
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "username"
        `)
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying
        `)
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"
        `)
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `)
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "username" character varying NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
        `)
  }
}
*/
