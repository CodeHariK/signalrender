let currentSubscriber: null | (() => void) = null;
let currentCleanup: (() => void) | null = null;
let pendingMounts: (() => void)[] = [];
let pendingCleanups: (() => void)[] = [];

export function onMount(fn: () => void) {
    pendingMounts.push(fn);
}

export function onCleanup(fn: () => void) {
    currentCleanup = fn;
}

export function createEffect(fn: () => void) {
    let cleanupFn: (() => void) | void;

    const run = () => {
        if (cleanupFn) cleanupFn();
        currentSubscriber = run;
        cleanupFn = fn();
        currentSubscriber = null;
    };

    run();
}

export function createSignal<T>(initial: T): [() => T, (v: T) => void] {
    let value = initial;
    const subscribers = new Set<() => void>();

    const get = () => {
        if (currentSubscriber) subscribers.add(currentSubscriber);
        return value;
    };

    const set = (v: T) => {
        value = v;
        subscribers.forEach((fn) => fn());
    };

    return [get, set];
}

export function autorun(fn: () => JSX.Element): JSX.Element {
    if (currentCleanup) currentCleanup();

    // Use a placeholder to wrap around the dynamic content
    let currentElement = fn();

    const rerender = () => {
        const newElement = fn();
        currentElement.replaceWith(newElement);
        currentElement = newElement;
    };

    currentSubscriber = rerender;
    fn(); // Collect dependencies
    currentSubscriber = null;

    pendingMounts.forEach((m) => m());
    pendingMounts = [];

    if (currentCleanup) {
        pendingCleanups.push(currentCleanup);
        currentCleanup = null;
    }

    return currentElement;
}