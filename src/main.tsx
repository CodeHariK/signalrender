/// <reference path="./jsx.d.ts" />
import { h, Fragment } from './jsx-runtime';
import { createEffect, createSignal, onCleanup, onMount } from './signal';
import './style.css';

const [count, setCount] = createSignal(0);

export function Counter(props: { style?: Partial<CSSStyleDeclaration> }) {

  createEffect(() => {
    console.log("Effect runs");

    onMount(() => console.log("Mounted!"));
    onCleanup(() => console.log("Cleaned up!"));

    return () => console.log("Effect cleanup");
  });

  return (
    <div style={props.style}>
      <p>Count: {count}</p>
      <button onclick={() => setCount(count() + 1)}>+</button>
    </div>
  );
}

function App() {
  let btnRef: HTMLButtonElement | null = null;

  return (
    <div class="container" style={{ border: "5px dashed yellow", borderRadius: "20px", padding: "1rem" }}>
      <h1>Hello World</h1>
      <button
        onmouseover={() => { console.log("Hello") }}
        ref={(el: HTMLButtonElement) => (btnRef = el)}
        onclick={() => alert("Clicked!" + btnRef?.innerHTML)}
        style={{ fontWeight: "bold", marginTop: "10px" }}
      >
        Click Me
      </button>
      <>
        <h1>Hello {count} {count()}</h1>

        {
          count() % 2 == 1 ?
            <Counter style={{ background: "red" }} />
            :
            <Counter style={{ background: "blue" }} />
        }

      </>
    </div>
  );
}

document.getElementById('app')!.appendChild(<App />)
