import * as localStrategy from "passport-local";
import bcrypt from "bcrypt";
import userModel, { UserType } from "../../http/models/user_model";

export const serializeUser = (
  user: any,
  done: (err: any, data: any) => void
) => {
  const id = user._id.toString();

  done(null, id);
};

export const deserializeUser = async (id: any, done: any) => {
  try {
    const findUser = await userModel.findOne({ _id: id });
    if (!findUser) throw new Error("User Not Found");
    const { password, ...reestUser }: any = findUser._doc;
    done(null, reestUser);
  } catch (err) {
    done(err, null);
  }
};

export default new localStrategy.Strategy(
  {
    usernameField: "email",
  },
  async (
    email: string,
    password: string,
    done: (err: any, data: any) => void
  ) => {
    const isExits: any = await userModel
      .findOne({
        email: email,
      })
      .exec();

    if (!isExits || !bcrypt.compareSync(password, isExits.password)) {
      const error = new Error("the credential is not correct");
      return done(error, null);
    }
    const { password: pass, ...reestUser } = await isExits._doc;

    return done(null, reestUser);
  }
);
