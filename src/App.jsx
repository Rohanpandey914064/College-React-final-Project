import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Deconstruct from "./pages/Deconstruct";
import Substitute from "./pages/Substitute";
import Explore from "./pages/Explore";
import Visualize from "./pages/Visualize";
import Localize from "./pages/Localize";

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/deconstruct" element={<Deconstruct />} />
      <Route path="/substitute"  element={<Substitute />} />
      <Route path="/explore"     element={<Explore />} />
      <Route path="/visualize"   element={<Visualize />} />
      <Route path="/localize"    element={<Localize />} />
    </Routes>
  );
}
