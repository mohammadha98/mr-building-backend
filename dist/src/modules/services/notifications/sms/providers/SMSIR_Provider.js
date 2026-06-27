"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("sms-typescript/lib");
class SMSIR_Provider {
    constructor() {
        this.token = "JJ8IfeMbjvF4sbLJjNL44Hx6zerka6ffZZd4DsmzGT06bScOeDqhDKeEdEMennrZ";
        this.lineNumber = 30007732011470;
        this.smsWebService = new lib_1.Smsir(this.token, this.lineNumber);
    }
    async send(message) {
        try {
            const credit = (await this.getCredit());
            if ((credit === null || credit === void 0 ? void 0 : credit.status) == 1) {
                await this.smsWebService.SendVerifyCode(String(message.recipient), Number(message.templateID), [{ name: message.parameterKey, value: String(message.message) }]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async bulk(data) {
        const credit = (await this.getCredit());
        if ((credit === null || credit === void 0 ? void 0 : credit.status) == 1) {
            try {
                console.log(data.mobiles);
                const result = await this.smsWebService.SendBulk(data.messageText, data.mobiles, null, this.lineNumber);
                console.log(result.data);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    async getCredit() {
        const credit = await this.smsWebService.getCredit();
        return credit.data;
    }
}
exports.default = SMSIR_Provider;
//# sourceMappingURL=SMSIR_Provider.js.map