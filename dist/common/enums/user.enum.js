"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["ADMIN"] = "ADMIN";
    RoleEnum["user"] = "USER";
    RoleEnum["MANAGER"] = "MANAGER";
    RoleEnum["STORE_KEEPER"] = "STORE_KEEPER";
    RoleEnum["ACCOUNTANT"] = "ACCOUNTANT";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var EmailEnum;
(function (EmailEnum) {
    EmailEnum["confirmedEmail"] = "confirmedEmail";
    EmailEnum["forgetPassword"] = "forgetPassword";
    EmailEnum["lowStock"] = "lowStock";
})(EmailEnum || (exports.EmailEnum = EmailEnum = {}));
