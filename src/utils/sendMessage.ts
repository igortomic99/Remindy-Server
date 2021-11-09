import Vonage from "@vonage/server-sdk";
import dotenv from "dotenv";

export const sendMessage = async (from: string, to: string, text: string) => {
  dotenv.config();
  const vonage = new Vonage({
    apiKey: process.env.API_KEY as any,
    apiSecret: process.env.API_SECRET as any,
  });
  vonage.message.sendSms(from, to, text,(err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(responseData);
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};
