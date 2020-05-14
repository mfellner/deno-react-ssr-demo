import React from "https://cdn.pika.dev/react@16.13.1";

type Props = {
  title: string;
  html: string;
};

export default function Document({ title, html }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script defer src="/static/main.js" type="module"></script>
      </head>

      <body>
        <div id="main" dangerouslySetInnerHTML={{ __html: html }} />
      </body>
    </html>
  );
}
