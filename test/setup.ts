import '@testing-library/jest-dom';

const localStorageMock = (() => {
    let store: { [key: string]: string } = {};

    return {
        getItem(key: string): string | null {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock
});