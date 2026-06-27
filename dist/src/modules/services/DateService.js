"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateToInternational = exports.DateToPersian = void 0;
const moment = require("moment");
const jmoment = require("jalali-moment");
jmoment().locale("fa").format("YYYY/M/D");
function DateToPersian(created_at) {
    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
    const time = jmoment(created_at).locale("fa").format("HH:mm");
    return {
        day,
        month,
        year,
        time,
    };
}
exports.DateToPersian = DateToPersian;
function DateToInternational(input, format = "YYYY-MM-DD HH:mm:ss") {
    return moment(input).locale("en").format(format);
}
exports.DateToInternational = DateToInternational;
//# sourceMappingURL=DateService.js.map