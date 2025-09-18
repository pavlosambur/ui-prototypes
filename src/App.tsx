import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediumBannerPage } from "./pages/medium-banner";

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/ui-prototypes/">
      <Routes>
        <Route
          path="/"
          element={<span className="text-white">hello world!</span>}
        />
        <Route path="/medium-banner" element={<MediumBannerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
