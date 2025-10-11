/*
  Warnings:

  - You are about to drop the `Term` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `inTouchPerson` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.
  - Added the required column `term` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Term";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobId" TEXT,
    "category" TEXT,
    "opportunity" TEXT,
    "location" TEXT,
    "flexibility" TEXT,
    "status" TEXT,
    "dateApply" TEXT,
    "contact" TEXT,
    "jobDescription" TEXT,
    "skills" TEXT
);
INSERT INTO "new_Job" ("category", "company", "dateApply", "flexibility", "id", "jobId", "location", "opportunity", "role", "status") SELECT "category", "company", "dateApply", "flexibility", "id", "jobId", "location", "opportunity", "role", "status" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
