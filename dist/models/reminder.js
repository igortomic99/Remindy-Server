"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderModel = void 0;
const mongoose_1 = require("mongoose");
const ReminderSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    text: { type: String, required: true },
    userID: { type: String, required: true },
});
exports.ReminderModel = (0, mongoose_1.model)("Reminder", ReminderSchema);
//# sourceMappingURL=reminder.js.map