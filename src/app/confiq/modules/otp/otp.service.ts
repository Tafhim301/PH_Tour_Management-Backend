import crypto from "crypto";
import { redisClient } from "../../redis.config";
import { sendEmail } from "../../../utils/sendmail";
import AppError from "../../../ErrorHelpers/appError";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const otp = generateOtp();

  const redisKey = `otp: ${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP code",
    templateName: "otp",
    templateData: {
      name: name,
      otp,
    },
  });
};
const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }
  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(401, "Invalid OTP");
  }

  if (savedOtp !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),

    redisClient.del([redisKey]),
  ]);

  return {};
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
