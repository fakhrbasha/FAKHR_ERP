"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var EmailEnum;
(function (EmailEnum) {
    EmailEnum["confirmedEmail"] = "confirmedEmail";
    EmailEnum["forgetPassword"] = "forgetPassword";
})(EmailEnum || (exports.EmailEnum = EmailEnum = {}));
