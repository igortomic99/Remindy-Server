import { CronJob, CronTime } from "cron";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { ReminderModel } from "../models/reminder";
import { MyContext } from "../types";
import { Reminder } from "../types/Reminder";
import { sendMessage } from "../utils/sendMessage";

@Resolver()
export class ReminderResolver {
  @Mutation(() => Reminder)
  @UseMiddleware(isAuth)
  async addReminder(
    @Arg("text") text: string,
    @Arg("date") date: Date,
    @Arg("phoneNumber") phoneNumber: string,
    @Ctx() { req }: MyContext
  ) {
    const userID = req.session.userId;
    if (date.getTime() < Date.now()) {
      throw new Error("wrong date");
    }
    let reminder: any;
    reminder = new ReminderModel({
      date,
      text,
      userID,
    });
    let sender = "Remindy";
    let dateI = new Date(date)
    await reminder.save();
    let job = new CronJob(
      dateI,
      async () => {
        sendMessage(sender, phoneNumber, text);
        await ReminderModel.deleteOne().where({ _id: reminder._id });
      },
      null,
      true
    );
    console.log(job);
    return reminder;
  }

  @Query(() => [Reminder])
  @UseMiddleware(isAuth)
  async userReminders(@Ctx() { req }: MyContext) {
    const userID = req.session.userId as any;
    const reminders = await ReminderModel.find().where({ userID });
    return reminders;
  }

  @Query(() => Reminder)
  @UseMiddleware(isAuth)
  async reminder(@Arg("id") id: string) {
    const reminder = await ReminderModel.findById(id);
    return reminder;
  }

  @Mutation(() => Reminder)
  @UseMiddleware(isAuth)
  async updateReminder(
    @Arg("id") id: string,
    @Arg("text") text: string,
    @Arg("date") date: Date
  ) {
    //DONT WANT TO PAY FOR MONGODB SO THEREFORE THIS FUNCTION IS NOT SUPPORTED
    const reminder = await ReminderModel.findOneAndUpdate(
      { _id: id },
      { date, text }
    );
    //BUT THIS CASUALLY WORKS :)
    return reminder;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteReminders() {
    ///PRODUCTION
    await ReminderModel.deleteMany({});
    return true;
  }
}
