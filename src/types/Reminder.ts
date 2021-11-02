import { ObjectType, Field} from "type-graphql";

@ObjectType()
export class Reminder{
  @Field()
  _id: string;

  @Field()
  date: Date;

  @Field()
  text: string;

}