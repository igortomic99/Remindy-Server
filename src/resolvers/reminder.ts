import { Reminder } from "../types/Reminder";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { ReminderModel } from "../models/reminder";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class ReminderResolver {
  @Mutation(() => Reminder)
  @UseMiddleware(isAuth)
  async addReminder(
    @Arg("text") text: string,
    @Arg("date") date: Date,
    @Ctx() { req }: MyContext
  ) {
    const userID = req.session.userId;
    if (date.getTime() < Date.now()) {
      throw new Error("wrong date");
    }
    const reminder = new ReminderModel({
      date,
      text,
      userID
    });
    await reminder.save();
    return reminder;
  }
  @Query(()=>[Reminder])
  @UseMiddleware(isAuth)
  async userReminders(
    @Ctx() { req }: MyContext,
  ){
    const userID = req.session.userId as any;
    const reminders = await ReminderModel.find().where(userID);
    return reminders;
  }
}
