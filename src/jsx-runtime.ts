type Props = Record<string, any>;

type FunctionComponent<P = {}> = (props: P & { children?: any }) => HTMLElement;

export function h<K extends keyof JSX.IntrinsicElements>(
    tag: K | FunctionComponent<any>,
    props: JSX.IntrinsicElements[K] | null,
    ...children: any[]
): HTMLElement {
    if (typeof tag === 'function') {
        return tag({ ...props, children: children.flat() });
    }

    // Regular HTML tag (like 'div', 'button', etc.)
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(props ?? {})) {
        if (key === 'children') continue;

        if (key === 'ref' && typeof value === 'function') {
            value(element); // call the ref callback with element
        } else if (key === 'className') {
            element.setAttribute('class', value);
        } else if (key === 'style' && value && typeof value === 'object' && !Array.isArray(value)) {
            const styleString = Object.entries(value as Record<string, string | number>)
                .map(([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${v}`)
                .join(';');
            element.setAttribute('style', styleString);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }

    for (const child of children.flat()) {
        element.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }

    return element;
}

export function Fragment(props: Props) {
    const fragment = document.createDocumentFragment();
    const children = props.children || [];
    for (const child of children.flat()) {
        fragment.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return fragment;
}
