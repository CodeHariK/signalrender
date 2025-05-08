let currentSubscriber: null | (() => void) = null;
let currentCleanups: (() => void)[] | null = null;
let pendingMounts: (() => void)[] = [];

export function onMount(fn: () => void) {
    pendingMounts.push(fn);
}


export function onCleanup(fn: () => void) {
    if (currentCleanups) {
        currentCleanups.push(fn);
    }
}

export function createEffect(fn: () => void) {
    let cleanupFn: (() => void) | void;
    let prevCleanups: (() => void)[] | null = null;

    const run = () => {
        if (cleanupFn) cleanupFn(); // effect-returned cleanup
        if (prevCleanups) {
            for (const fn of prevCleanups) fn(); // user cleanups
        }

        currentSubscriber = run;
        currentCleanups = [];
        cleanupFn = fn(); // may return another cleanup
        currentSubscriber = null;

        prevCleanups = currentCleanups;
        currentCleanups = null;
    };

    run();

    while (pendingMounts.length) {
        const mountFn = pendingMounts.shift();
        if (mountFn) mountFn();
    }
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
