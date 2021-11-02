"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const server_sdk_1 = __importDefault(require("@vonage/server-sdk"));
const sendMessage = (from, to, text) => __awaiter(void 0, void 0, void 0, function* () {
    const vonage = new server_sdk_1.default({
        apiKey: "2fac2ecf",
        apiSecret: "i8Enh5qOtqgtRMg7",
    });
    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        }
        else {
            if (responseData.messages[0]["status"] === "0") {
                console.log("Message sent successfully.");
            }
            else {
                console.log(`Message failed with error: ${responseData.messages[0]["error-text"]}`);
            }
        }
    });
});
exports.sendMessage = sendMessage;
//# sourceMappingURL=sendMessage.js.map