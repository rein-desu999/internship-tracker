-- CreateTable
CREATE TABLE "Term" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobId" TEXT,
    "category" TEXT NOT NULL,
    "opportunity" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "flexibility" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dateApply" DATETIME NOT NULL,
    "inTouchPerson" TEXT,
    "termId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
