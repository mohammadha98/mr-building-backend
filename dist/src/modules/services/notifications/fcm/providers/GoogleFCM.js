"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const firebase = require("firebase-admin");
const path = require("path");
firebase.initializeApp({
    credential: firebase.credential.cert(path.join(__dirname, "../../../../../../../", "firebase-adminsdk.json"))
});
let GoogleFCM = class GoogleFCM {
    constructor() {
    }
    async send(data) {
        await firebase
            .messaging()
            .send({
            data: {
                body: data.body,
                key: data.key
            },
            token: data.notification_token,
            android: { priority: "high" }
        })
            .catch((error) => {
            console.log("Failed To Send FCM");
        });
    }
    async sendToTopic(data) {
        console.log('sendToTopic ', data.topic);
        await firebase
            .messaging()
            .send({
            topic: data.topic,
            data: { body: data.body, key: data.key }
        })
            .catch((error) => {
            console.log("Failed To Topic FCM");
            console.error(error);
        });
    }
    async subscribeToTopic(notification_tokens, topic) {
        console.log('subscribeToTopic');
        console.log({ topic });
        await firebase
            .messaging()
            .subscribeToTopic(notification_tokens, topic)
            .then((response) => {
            console.log("Successfully subscribed to topic");
        })
            .catch((error) => {
            console.log("Error subscribing to topic:", error);
        });
    }
    async unSubscribeToTopic(notification_tokens, topic) {
        await firebase
            .messaging()
            .unsubscribeFromTopic(notification_tokens, topic)
            .then((response) => {
            console.log("Successfully unSubscribe to topic:", response);
            console.log({ response });
        })
            .catch((error) => {
            console.log("Error unSubscribe to topic:", error);
        });
    }
};
GoogleFCM = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleFCM);
exports.default = GoogleFCM;
//# sourceMappingURL=GoogleFCM.js.map