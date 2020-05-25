export class Lazy<T> {
    private supplier: () => T;
    private isResolved: boolean = false;
    private resolvedValue?: T;

    public constructor(supplier: () => T) {
        this.supplier = supplier;
    }

    public get(): T {
        if (!this.isResolved) {
            this.resolvedValue = this.supplier();
            this.isResolved = true;
        }
        return this.resolvedValue!;
    }
}

export class AsyncLazy<T> {
    private supplier: () => Promise<T>;
    private isResolved: boolean = false;
    private resolvedValue?: T;

    public constructor(supplier: () => Promise<T>) {
        this.supplier = supplier;
    }

    public async get(): Promise<T> {
        if (!this.isResolved) {
            this.resolvedValue = await this.supplier();
            this.isResolved = true;
        }
        return this.resolvedValue!;
    }
}