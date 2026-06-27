"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateToPersian = void 0;
const jmoment = require("jalali-moment");
function convertDateToPersian(created_at) {
    const currentYear = Number(jmoment(new Date(Date.now())).locale("fa").format("YYYY"));
    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
    return {
        day,
        month,
        year,
    };
}
exports.convertDateToPersian = convertDateToPersian;
//# sourceMappingURL=convertDateToPersian.js.map