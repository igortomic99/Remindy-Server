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
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const uri = process.env.DB_CONN_STRING;
    yield mongoose_1.default
        .connect(uri)
        .then((_result) => {
        console.log("connected to MongoDB");
    })
        .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });
});
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=mongo.js.map