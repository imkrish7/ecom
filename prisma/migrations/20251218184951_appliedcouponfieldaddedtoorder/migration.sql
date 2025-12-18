-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT,
    "paymentStatus" TEXT,
    "status" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "totalAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("completed", "createdAt", "id", "paymentId", "paymentStatus", "status", "totalAmount", "updatedAt", "userId") SELECT "completed", "createdAt", "id", "paymentId", "paymentStatus", "status", "totalAmount", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
