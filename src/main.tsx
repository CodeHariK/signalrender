/// <reference path="./jsx.d.ts" />
import { h, Fragment } from './jsx-runtime';
import { autorun, createEffect, createSignal, onCleanup, onMount } from './signal';
import './style.css';

export function Counter() {
  const [count, setCount] = createSignal(0);

  onMount(() => {
    console.log("Counter mounted");

    onCleanup(() => {
      console.log("Counter cleanup");
    });
  });

  createEffect(() => {
    console.log("Count changed:", count());
  });

  return autorun(() => {
    return <div>
      <p>Count: {count()}</p>
      <button onclick={() => setCount(count() + 1)}>+</button>
    </div>
  });
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
        <h1>Hello</h1>
        <Counter />
        <Counter />
      </>
    </div>
  );
}

document.getElementById('app')!.appendChild(<App />)
