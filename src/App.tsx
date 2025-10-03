import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediumBannerPage } from "./pages/medium-banner";
import { ShakerPage } from "./pages/shaker";

const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/"
          element={<span className="text-white">hello world!</span>}
        />
        <Route path="/medium-banner" element={<MediumBannerPage />} />
        <Route path="/shaker" element={<ShakerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
