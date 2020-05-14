import ReactDOM from "https://cdn.pika.dev/react-dom@16.13.1";
import React from "https://cdn.pika.dev/react@16.13.1";
import App from "./app.tsx";

const url = "/static/my-component.tsx";
const element = React.createElement(App, { url });

ReactDOM.hydrate(element, document.getElementById("main"));
