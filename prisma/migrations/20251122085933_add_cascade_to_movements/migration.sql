-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_brandId_fkey";

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
