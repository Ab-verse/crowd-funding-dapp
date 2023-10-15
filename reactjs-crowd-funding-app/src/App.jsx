import React from "react";
import HomePage from "./components/HomePage";
import { Route, Routes } from "react-router-dom";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import DonateCampaignPage from "./pages/DonateCampaign";

const App = () => {
  return (
    <div className="m-20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createCampaignPage" element={<CreateCampaignPage />} />
        <Route path="/donateCampaignPage" element={<DonateCampaignPage />} />
      </Routes>
    </div>
  );
};

export default App;
