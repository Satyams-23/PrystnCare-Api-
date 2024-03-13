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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String },
    password: { type: String },
    username: { type: String },
    role: { type: String },
    phoneNumber: { type: String },
    countryCode: { type: String },
    otp: { type: String },
    otpExpiration: { type: Date },
    registerotp: { type: String },
    loginotp: { type: String },
    registerstatus: { type: String },
    sessionId: { type: String },
    confirmPassword: { type: String },
    newPassword: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    passwordChangeAt: { type: Date },
    token: { type: String },
    confirmpassword: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '2m' },
    },
});
userSchema.statics.isUserExist = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Auth.findOne({ phoneNumber });
    });
};
// userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
userSchema.pre('save', function (next) {
    // Set the expiration time to 5 minutes from now
    // this.expireTimeAt = new Date();
    // this.expireTimeAt.setMinutes(this.expireTimeAt.getMinutes() + 1);
    this.createdAt = new Date();
    next();
});
exports.Auth = (0, mongoose_1.model)('auth', userSchema);
