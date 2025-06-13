class Subject {
    constructor() {
        this.observers = new Set();
    }

    subscribe(observer) {
        this.observers.add(observer);
        return () => this.unsubscribe(observer);
    }

    unsubscribe(observer) {
        this.observers.delete(observer);
    }

    notify(event) {
        this.observers.forEach(observer => observer(event));
    }
}

export { Subject };
