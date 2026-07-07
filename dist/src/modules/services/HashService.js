"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.compareText = exports.hashPassword = exports.hashFromUUI = exports.randomHash = exports.decryptText = exports.cryptText = void 0;
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const crypto_js_1 = require("crypto-js");
const secrectKey = "SH3N!D@rSeKR3TkeY@pPl!C@$3N";
function cryptText(plainText) {
    return crypto_js_1.default.AES.encrypt(plainText, secrectKey).toString();
}
exports.cryptText = cryptText;
function decryptText(ciphertext) {
    const bytes = crypto_js_1.default.AES.decrypt(ciphertext, secrectKey);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptText = decryptText;
function randomHash(length = 20) {
    return (0, crypto_1.randomBytes)(length).toString("hex");
}
exports.randomHash = randomHash;
function hashFromUUI() {
    return (0, uuid_1.v4)();
}
exports.hashFromUUI = hashFromUUI;
function hashPassword(plainText) {
    return (0, bcrypt_1.hashSync)(plainText, 10);
}
exports.hashPassword = hashPassword;
function compareText(plainText, hashText) {
    return (0, bcrypt_1.compareSync)(plainText, hashText);
}
exports.compareText = compareText;
function comparePassword(plainPassword, hashPassword) {
    return (0, bcrypt_1.compareSync)(plainPassword, hashPassword);
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=HashService.js.map