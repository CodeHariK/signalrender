declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

export { };

declare global {
    namespace JSX {
        type Element = HTMLElement; // | DocumentFragment;

        interface IntrinsicElements {
            div: HTMLAttributes<HTMLDivElement>;
            span: HTMLAttributes<HTMLSpanElement>;
            p: HTMLAttributes<HTMLParagraphElement>;
            h1: HTMLAttributes<HTMLHeadingElement>;
            button: HTMLAttributes<HTMLButtonElement>;
            input: HTMLAttributes<HTMLInputElement>;
            fragment: { children?: Element[] };
            // Add more tags as needed
        }

        interface HTMLAttributes<T> {
            class?: string;
            id?: string;
            style?: Partial<CSSStyleDeclaration>;
            children?: any;

            // Refs
            ref?: (el: T) => void;

            // Event Handlers
            onclick?: (event: MouseEvent) => void;
            oninput?: (event: InputEvent) => void;
            onkeydown?: (event: KeyboardEvent) => void;
            onkeyup?: (event: KeyboardEvent) => void;
            onmouseover?: (event: MouseEvent) => void;
            onmouseout?: (event: MouseEvent) => void;
            onfocus?: (event: FocusEvent) => void;
            onblur?: (event: FocusEvent) => void;
            // Add more events here if needed
        }
    }
}
