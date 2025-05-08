import { createEffect } from "./signal";

type Props = Record<string, any>;

export function h<K extends keyof JSX.IntrinsicElements>(
    tag: K | Function,
    props: JSX.IntrinsicElements[K] | null,
    ...children: any[]
): HTMLElement | Node {
    // If the tag is a function component
    if (typeof tag === 'function') {
        // If it's a function component, call it and return its result
        return tag({ ...props, children });
    }

    // Otherwise, treat it as a standard HTML element tag
    const element = document.createElement(tag);

    // Handle props
    for (const [key, value] of Object.entries(props ?? {})) {
        if (key === 'style' && typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                element.style[k as any] = String(v);
            }
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'ref' && typeof value === 'function') {
            value(element);
        } else {
            element.setAttribute(key, value as string);
        }
    }

    // Handle children
    for (const child of children.flat()) {
        if (typeof child === 'function') {
            // It's likely a signal getter
            const textNode = document.createTextNode(String(child()));
            element.appendChild(textNode);

            createEffect(() => {
                textNode.textContent = String(child());
            });
        } else {
            element.append(child instanceof Node ? child : document.createTextNode(String(child)));
        }
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
