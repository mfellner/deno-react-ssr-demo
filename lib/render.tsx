import React from "https://cdn.pika.dev/react@16.13.1";
// @deno-types="../types/react-dom/server.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server";
import App from "./components/app.tsx";
import Loading from "./components/loading.tsx";
import Document from "./document.tsx";
import { promiseTimeout, PromiseTimeoutError } from "./promise-timeout.ts";

async function loadComponent(url: string) {
  try {
    const { default: Component } = await promiseTimeout(import(url), 100);
    return Component;
  } catch (err) {
    if (err instanceof PromiseTimeoutError) {
      return Loading;
    } else {
      throw err;
    }
  }
}

export async function renderHTML() {
  const component = await loadComponent("./components/my-component.tsx");
  const html = ReactDOMServer.renderToString(<App component={component} />);

  return ReactDOMServer.renderToStaticMarkup(
    <Document title="Deno React SSR demo" html={html} />
  );
}
