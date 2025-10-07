import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// React Router
import { BrowserRouter } from "react-router-dom";

// Redux + Persist
import { Provider } from "react-redux";
import { Store } from "./Store/Store";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/lib/integration/react";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Toaster notifications
import { Toaster } from "./components/ui/sonner.jsx";

const queryClient = new QueryClient();
const persistor = persistStore(Store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster />
          </QueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
