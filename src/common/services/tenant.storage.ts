import { AsyncLocalStorage } from "node:async_hooks";

class TenantStorage {
    private readonly storage = new AsyncLocalStorage<string>();

    run(companyId: string, callback: () => void) {
        this.storage.run(companyId, callback);
    }

    getCompanyId(): string | undefined {
        return this.storage.getStore();
    }
}

export const tenantStorage = new TenantStorage();
