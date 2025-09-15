import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MediumBanner from "./features/medium-banner/MediumBanner";

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/ui-prototypes/">
      <Routes>
        <Route path="/" element={<div>App</div>} />
        <Route path="/medium-banner" element={<MediumBanner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
