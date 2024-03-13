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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const User_Constant_1 = require("./User.Constant");
const userSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    confirmpassword: {
        type: String,
    },
    role: {
        type: String,
        enum: User_Constant_1.Role,
    },
    otp: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    otpExpiration: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    passwordChangedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
userSchema.statics.isNumberExist = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ phoneNumber });
    });
};
userSchema.statics.isUserExist = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne(query);
    });
};
userSchema.statics.isResetPassword = function (hashedToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
    });
};
userSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(givenPassword, savedPassword);
    });
};
userSchema.methods.createPasswordResetToken =
    function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
            yield this.save({ validateBeforeSave: false });
            return resetToken;
        });
    };
userSchema.methods.ChangePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
