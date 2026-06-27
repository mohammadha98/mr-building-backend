import { randomBytes } from "crypto";
import { v4 as uuid } from "uuid";
import { hashSync, compareSync } from "bcrypt";
import CryptoJS from "crypto-js";

const secrectKey = "SH3N!D@rSeKR3TkeY@pPl!C@$3N";

export function cryptText(plainText: string): any {
  return CryptoJS.AES.encrypt(plainText, secrectKey).toString();
}

export function decryptText(ciphertext: any) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secrectKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function randomHash(length = 20): string {
  return randomBytes(length).toString("hex");
}

export function hashFromUUI(): string {
  return uuid();
}

export function hashPassword(plainText: string): string {
  return hashSync(plainText, 10);
}

export function compareText(plainText: string, hashText: string): boolean {
  return compareSync(plainText, hashText);
}

export function comparePassword(
  plainPassword: string,
  hashPassword: string
): boolean {
  return compareSync(plainPassword, hashPassword);
}
