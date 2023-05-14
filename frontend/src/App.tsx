import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./components/Home"
import Join from "./components/Join"
import Room from "./components/Room"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
