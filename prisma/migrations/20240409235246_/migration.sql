-- DropForeignKey
ALTER TABLE "ExtraCompounds" DROP CONSTRAINT "ExtraCompounds_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ExtraCompounds" DROP CONSTRAINT "ExtraCompounds_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "HormonalProtocol" DROP CONSTRAINT "HormonalProtocol_accountId_fkey";

-- DropForeignKey
ALTER TABLE "HormonalProtocol" DROP CONSTRAINT "HormonalProtocol_protocolId_fkey";

-- DropForeignKey
ALTER TABLE "Hormone" DROP CONSTRAINT "Hormone_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Hormone" DROP CONSTRAINT "Hormone_hormonalProtocolId_fkey";

-- DropForeignKey
ALTER TABLE "Protocol" DROP CONSTRAINT "Protocol_accountId_fkey";

-- AlterTable
ALTER TABLE "ExtraCompounds" ALTER COLUMN "protocolId" DROP NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HormonalProtocol" ALTER COLUMN "protocolId" DROP NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Hormone" ALTER COLUMN "hormonalProtocolId" DROP NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Protocol" ALTER COLUMN "accountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Hormone" ADD CONSTRAINT "Hormone_hormonalProtocolId_fkey" FOREIGN KEY ("hormonalProtocolId") REFERENCES "HormonalProtocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hormone" ADD CONSTRAINT "Hormone_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HormonalProtocol" ADD CONSTRAINT "HormonalProtocol_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HormonalProtocol" ADD CONSTRAINT "HormonalProtocol_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraCompounds" ADD CONSTRAINT "ExtraCompounds_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraCompounds" ADD CONSTRAINT "ExtraCompounds_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
