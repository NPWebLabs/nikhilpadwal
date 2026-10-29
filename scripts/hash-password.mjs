import bcrypt from "bcryptjs";
const pw = process.argv[2];
if (!pw || pw.length < 8) {
  console.error('Usage: npm run hash-password -- "YourStrongPassword"   (min 8 characters)');
  process.exit(1);
}
// bcrypt hashes contain "$", which .env loaders try to expand — so we store it base64-encoded.
const hash = Buffer.from(bcrypt.hashSync(pw, 12)).toString("base64");
console.log("\nSet this as ADMIN_PASSWORD_HASH (in .env locally and in Hostinger's environment variables):\n");
console.log(hash + "\n");
