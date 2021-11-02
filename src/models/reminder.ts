import { Model, model, Schema } from "mongoose";
import { Reminder } from "../types/Reminder";

const ReminderSchema: Schema = new Schema({
  date: { type: Date, required: true },
  text: { type: String, required: true },
  userID: { type: String, required: true },
});

export const ReminderModel: Model<Reminder> = model("Reminder", ReminderSchema);
