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
const cron_1 = require("cron");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const reminder_1 = require("../models/reminder");
const Reminder_1 = require("../types/Reminder");
const sendMessage_1 = require("../utils/sendMessage");
let ReminderResolver = class ReminderResolver {
    addReminder(text, date, phoneNumber, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.session.userId;
            if (date.getTime() < Date.now()) {
                throw new Error("wrong date");
            }
            let reminder;
            reminder = new reminder_1.ReminderModel({
                date,
                text,
                userID,
            });
            let sender = "Remindy";
            let dateI = new Date(date);
            yield reminder.save();
            let job = new cron_1.CronJob(dateI, () => __awaiter(this, void 0, void 0, function* () {
                (0, sendMessage_1.sendMessage)(sender, phoneNumber, text);
                yield reminder_1.ReminderModel.deleteOne().where({ _id: reminder._id });
            }), null, true);
            console.log(job);
            return reminder;
        });
    }
    userReminders({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.session.userId;
            const reminders = yield reminder_1.ReminderModel.find().where({ userID });
            return reminders;
        });
    }
    reminder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reminder = yield reminder_1.ReminderModel.findById(id);
            return reminder;
        });
    }
    updateReminder(id, text, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const reminder = yield reminder_1.ReminderModel.findOneAndUpdate({ _id: id }, { date, text });
            return reminder;
        });
    }
    deleteReminders() {
        return __awaiter(this, void 0, void 0, function* () {
            yield reminder_1.ReminderModel.deleteMany({});
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Reminder_1.Reminder),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("text")),
    __param(1, (0, type_graphql_1.Arg)("date")),
    __param(2, (0, type_graphql_1.Arg)("phoneNumber")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date, String, Object]),
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
__decorate([
    (0, type_graphql_1.Query)(() => Reminder_1.Reminder),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReminderResolver.prototype, "reminder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Reminder_1.Reminder),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("text")),
    __param(2, (0, type_graphql_1.Arg)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date]),
    __metadata("design:returntype", Promise)
], ReminderResolver.prototype, "updateReminder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReminderResolver.prototype, "deleteReminders", null);
ReminderResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ReminderResolver);
exports.ReminderResolver = ReminderResolver;
//# sourceMappingURL=reminder.js.map