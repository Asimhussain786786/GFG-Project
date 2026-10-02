import { db } from './models/storage.js';

async function runSeed() {
  console.log('🔄 Executing database seed for KIIT Society Hub...');
  await db.init(true);
  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error during database seed:', err);
  process.exit(1);
});
