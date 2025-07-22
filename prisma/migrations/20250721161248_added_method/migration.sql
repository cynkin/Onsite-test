/*
  Warnings:

  - Added the required column `method` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "method" TEXT NOT NULL;
