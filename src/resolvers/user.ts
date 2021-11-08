import { User } from "../types/User";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { MyContext } from "../types";
import { UserModel } from "../models/user";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username too short",
          },
        ],
      };
    }
    if (options.username.includes("@")) {
      return {
        errors: [
          {
            field: "username",
            message: "Cannot include @",
          },
        ],
      };
    }
    if (options.email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      };
    }
    if (!options.email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Password too short",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = new UserModel({
        username: options.username,
        email: options.email,
        phoneNumber: options.phoneNumber,
        password: hashedPassword,
      });
      await user.save();
    } catch (err) {
      if (err.message.includes("E11000")) {
        return {
          errors: [
            {
              field: "username",
              message: "PhoneNumber ,username or email already in use",
            },
          ],
        };
      }
      console.log(err.message);
    }
    req.session.userId = user?._id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | null> {
    const user = await UserModel.findOne().where({username});
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Could not find username",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user._id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  @Query(() => User)
  async me(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("you are not logged in");
    }
    const user = await UserModel.findOne().where({_id:userId});
    return user;
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async editUser(
    @Ctx() { req }: MyContext,
    @Arg("email") email: string,
    @Arg("phoneNumber") phoneNumber: number,
  ) {
    if (email.length <= 2) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      };
    }
    if (!email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid email",
          },
        ],
      };
    }
    const user = await UserModel.findOneAndUpdate({_id:req.session.userId},{ email,phoneNumber})
    return user;
  }
  
}
