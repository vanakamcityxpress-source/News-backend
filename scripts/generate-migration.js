const { execSync } = require("child_process");

const nameArg = process.argv[2];
if (!nameArg) {
  console.error("Please provide a migration name.");
  process.exit(1);
}

const now = new Date();
const timestamp = now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14); 
const migrationName = `${timestamp}_${nameArg}`;

console.log(`Running: npm run typeorm -- migration:generate src/migrations/${migrationName}`);

try {
  execSync(
    `npm run typeorm -- migration:generate src/migrations/${migrationName}`,
    { stdio: "inherit" }
  );
} catch (error) {
  console.error("Error running migration generation:", error);
  process.exit(1);
}
  