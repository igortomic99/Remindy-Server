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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderResolver = void 0;
const Reminder_1 = require("../types/Reminder");
const type_graphql_1 = require("type-graphql");
const reminder_1 = require("../models/reminder");
const isAuth_1 = require("../middleware/isAuth");
let ReminderResolver = class ReminderResolver {
    addReminder(text, date, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.session.userId;
            if (date.getTime() < Date.now()) {
                throw new Error("wrong date");
            }
            const reminder = new reminder_1.ReminderModel({
                date,
                text,
                userID
            });
            yield reminder.save();
            return reminder;
        });
    }
    userReminders({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.session.userId;
            const reminders = yield reminder_1.ReminderModel.find().where(userID);
            return reminders;
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Reminder_1.Reminder),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("text")),
    __param(1, (0, type_graphql_1.Arg)("date")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date, Object]),
    __metadata("design:returntype", Promise)
], ReminderResolver.prototype, "addReminder", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Reminder_1.Reminder]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReminderResolver.prototype, "userReminders", null);
ReminderResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ReminderResolver);
exports.ReminderResolver = ReminderResolver;
//# sourceMappingURL=reminder.js.map