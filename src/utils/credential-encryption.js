import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";


export function encryptCredential(password) {
  const key = Buffer.from(
    process.env.STUDENT_CREDENTIAL_ENCRYPTION_KEY,
    "base64"
  );

  if (key.length !== 32) { 
    throw new Error(
      "STUDENT_CREDENTIAL_ENCRYPTION_KEY must decode to 32 bytes."
    );
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Store version, IV, authentication tag, and ciphertext together.
  return [
    "v1",
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}




function getEncryptionKey() {
  const key = Buffer.from(
    process.env.STUDENT_CREDENTIAL_ENCRYPTION_KEY,
    "base64"
  );

  if (key.length !== 32) {
    throw new Error("Invalid student credential encryption key.");
  }

  return key;
}

export function decryptCredential(encryptedPassword) {
  const [version, iv, authTag, encrypted] =
    encryptedPassword.split(":");

  if (version !== "v1" || !iv || !authTag || !encrypted) {
    throw new Error("Invalid encrypted credential format.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}