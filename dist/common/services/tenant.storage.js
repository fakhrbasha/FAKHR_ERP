"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
class TenantStorage {
    storage = new node_async_hooks_1.AsyncLocalStorage();
    run(companyId, callback) {
        this.storage.run(companyId, callback);
    }
    getCompanyId() {
        return this.storage.getStore();
    }
}
exports.tenantStorage = new TenantStorage();
