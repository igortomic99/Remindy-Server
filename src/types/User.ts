import { ObjectType, Field} from "type-graphql";

@ObjectType()
export class User{
  @Field()
  _id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: number;

  password: string;
}