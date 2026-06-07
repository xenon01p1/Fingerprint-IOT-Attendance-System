import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== DEVICES ===");
  const devices = await prisma.device.findMany();
  console.log(JSON.stringify(devices, null, 2));

  console.log("\n=== FINGERPRINTS ===");
  const fingerprints = await prisma.fingerprint.findMany({
    include: { device: true }
  });
  console.log(JSON.stringify(fingerprints, null, 2));

  console.log("\n=== FINGERPRINTS BY DEVICE ===");
  for (const device of devices) {
    const fps = await prisma.fingerprint.findMany({
      where: { deviceId: device.id }
    });
    console.log(`Device ${device.id} (${device.name}): ${fps.length} fingerprints`);
    console.log(`  Indexes: ${fps.map(fp => fp.fingerPrintIndex).join(", ")}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
