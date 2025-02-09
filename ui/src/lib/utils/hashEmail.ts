import { Email } from "@privy-io/react-auth";
import { createHash } from "crypto";

/**
 * 📌 Hash a user email using SHA-256
 * @param email - User's email to hash
 * @returns SHA-256 hashed email as a hex string
 */
export function hashEmail(email: Email | ""): string {
  if (!email) throw new Error("Email is required");

  return createHash("sha256")
    .update(email.address.trim().toLowerCase())
    .digest("hex");
}
