import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import "../css/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}
