-- DropForeignKey
ALTER TABLE "Train" DROP CONSTRAINT "Train_protocolId_fkey";

-- AlterTable
ALTER TABLE "Train" ALTER COLUMN "protocolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;
