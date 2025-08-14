"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appError_1 = __importDefault(require("../../../ErrorHelpers/appError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../../utils/userTokens");
const env_1 = require("../../env");
const user_interface_1 = require("../user/user.interface");
const sendmail_1 = require("../../../utils/sendmail");
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken.accessToken,
    };
});
const resetPassword = (newPassword, id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (id !== decodedToken.userId) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You Cannot change your password");
    }
    const doesUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!doesUserExist) {
        throw new appError_1.default(401, "User does not exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10);
    doesUserExist.password = hashedPassword;
    yield doesUserExist.save();
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    const matchpassword = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!matchpassword) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Password does not match");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10);
    user.password = hashedPassword;
    yield user.save();
    return true;
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (!user.password &&
        user.auths.some((providerObject) => providerObject.provider === "google")) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set your password.Now you can change your password from your profile");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    yield user.save();
    return true;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const doesUserExist = yield user_model_1.User.findOne({ email: email });
    if (!doesUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (doesUserExist.isActive === user_interface_1.isActive.BLOCKED ||
        doesUserExist.isActive === user_interface_1.isActive.INACTIVE) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${doesUserExist.isActive}`);
    }
    if (doesUserExist.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    if (!doesUserExist.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    const JwtPayload = {
        userId: doesUserExist._id,
        email: doesUserExist.email,
        role: doesUserExist.role
    };
    const resetToken = jsonwebtoken_1.default.sign(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${doesUserExist._id}&token=${resetToken}`;
    (0, sendmail_1.sendEmail)({
        to: doesUserExist.email,
        subject: "Password Reset",
        templateName: "ForgetPassword",
        templateData: {
            name: doesUserExist.name,
            resetUILink
        }
    });
});
exports.authServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
};
