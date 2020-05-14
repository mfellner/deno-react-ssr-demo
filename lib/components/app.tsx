import React, {
  ComponentType,
  Suspense,
  useMemo,
} from "https://cdn.pika.dev/react@16.13.1";
import Loading from "./loading.tsx";

function SuspendedComponent({ url }: { url: string }) {
  const Component = useMemo(() => React.lazy(() => import(url)), [url]);
  return (
    <Suspense fallback={<Loading />} unstable_avoidThisFallback>
      <Component />
    </Suspense>
  );
}

type Props = {
  url?: string;
  component?: ComponentType;
};

export default function App({ url, component: Component }: Props) {
  return (
    <main>
      {url ? (
        <SuspendedComponent url={url} />
      ) : Component ? (
        <Component />
      ) : (
        "Error, no component."
      )}
    </main>
  );
}
