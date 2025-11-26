import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import MyTemplates from "./pages/MyTemplates";
import Favorites from "./pages/Favorites";
import Guide from "./pages/Guide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdSenseGuide from "./pages/AdSenseGuide";
import ApiSettings from "./pages/ApiSettings";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/my-templates"} component={MyTemplates} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/guide"} component={Guide} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/adsense-guide"} component={AdSenseGuide} />
      <Route path={"/api-settings"} component={ApiSettings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
