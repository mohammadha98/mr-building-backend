"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CodeGenerator() {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.default = CodeGenerator;
//# sourceMappingURL=codeGenerator.js.map