import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "../node_modules/react-router-dom/dist/index";

import Home from "./components/Home";
import Join from "./components/Join";
import Room from "./components/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={<Navigate to="/join" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
