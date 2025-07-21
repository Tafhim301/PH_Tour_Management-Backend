/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "./modules/user/user.model";
import { Role } from "./modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "Email Not Found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("ggogle strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const doesUserExist = await User.findOne({ email });
        if (!doesUserExist) {
          return done(null, false, { message: "User does not Exist" });
        }

        const isGoogleAuthenticated = doesUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated && !doesUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through google. So if you want to login with credentials, then at first login with google and set a password for your gmail and then you can login with email and password",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          doesUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, doesUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});
