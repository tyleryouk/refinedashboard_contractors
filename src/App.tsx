import {
  Refine,
  GitHubBanner,
  WelcomePage,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

/* import dataProvider, {
  GraphQLClient,
  liveProvider,
} from "@refinedev/nestjs-query"; */
import { createClient } from "graphql-ws";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
//import { ColorModeContextProvider } from "./contexts/color-mode";
//import { Header } from "./components/header";
//import { Login } from "./pages/login";
//import { Register } from "./pages/register";
//import { ForgotPassword } from "./pages/forgotPassword";
//import { authProvider } from "./authProvider";
import { authProvider, dataProvider, liveProvider } from "./providers";
import { Home, ForgotPassword, Login, Register } from "./pages";
import Layout from "./components/layout";

const API_URL = "https://api.nestjs-query.refine.dev/graphql";
const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";

//const gqlClient = new GraphQLClient(API_URL);
//const wsClient = createClient({ url: WS_URL });

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        {/*<ColorModeContextProvider>*/}
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "aXogRn-RvqzvU-kFPM4y",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route index element={<WelcomePage />} />
                <Route index element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route 
                  element={<Authenticated
                  key = "authenticated-layout"
                  fallback = {<CatchAllNavigate to ="/login" />}
                  />}
                  > 
                  <Layout>
                    <Outlet  />
                  </Layout>
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
        {/*</ColorModeContextProvider>*/}
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
