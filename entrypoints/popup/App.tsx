import { createSignal, createEffect } from "solid-js";
import "./App.css";
import { evaluate } from "../parser/calculator";
import { onMessage } from "webext-bridge/popup";

function App() {
  let def = localStorage.getItem("expression") || "";
  let opt = localStorage.getItem("options") || "{}";
  const [opts, setOpts] = createSignal(JSON.parse(opt));
  const [expr, setExpr] = createSignal(def);
  createEffect(() => localStorage.setItem("expression", expr()));
  createEffect(() => console.log("opts are:", opts()));

  onMessage("options", (res) => {
    console.log("Received data:", res);
    let data = res.data as string;
    setOpts(data);
    localStorage.setItem("options", JSON.stringify(data));
  });

  return (
    <>
      <h1>Clockulator</h1>
      <textarea
        on:input={(event) => setExpr(event.target.value)}
        placeholder="Insert your expression here"
      >
        {def}
      </textarea>
      <For each={evaluate(expr(), opts())}>{(line) => <p>{line}</p>}</For>
    </>
  );
}

export default App;
