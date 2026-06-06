import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Today from "./pages/Today";
import Overview from "./pages/Overview";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;