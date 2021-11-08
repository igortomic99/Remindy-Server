"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const User_1 = require("../types/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const UsernamePasswordInput_1 = require("../types/UsernamePasswordInput");
const user_1 = require("../models/user");
const isAuth_1 = require("../middleware/isAuth");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const hashedPassword = yield argon2_1.default.hash(options.password);
            let user;
            try {
                user = new user_1.UserModel({
                    username: options.username,
                    email: options.email,
                    phoneNumber: options.phoneNumber,
                    password: hashedPassword,
                });
                yield user.save();
            }
            catch (err) {
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
            req.session.userId = user === null || user === void 0 ? void 0 : user._id;
            return { user };
        });
    }
    login(username, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findOne().where(username);
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
            const valid = yield argon2_1.default.verify(user.password, password);
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
            req.session.userId = user.id;
            return { user };
        });
    }
    logout({ req, res }) {
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
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            if (!userId) {
                throw new Error("you are not logged in");
            }
            const user = yield user_1.UserModel.findOne().where(userId);
            return user;
        });
    }
    editUser({ req }, email, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const user = yield user_1.UserModel.findOneAndUpdate({ _id: req.session.userId }, { email, phoneNumber });
            return user;
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => UsernamePasswordInput_1.UsernamePasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("username")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __param(2, (0, type_graphql_1.Arg)("phoneNumber")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map