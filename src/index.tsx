import * as React from "react";
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

import App from './App';

import './index.css';

//*
Sentry.init({
  dsn: "https://4707fe54ff434313b60256d876ad831b@o1247173.ingest.sentry.io/6407008",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
/*
Sentry.init({
  dsn: "https://6091db82e89c4100a0853299230772f7@o1247173.ingest.sentry.io/6407006",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
//*/
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
