import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reportpage from "./pages/Reportpage";
import TodopageWithoutAccount from "./pages/TodopageWithoutAccount";
import TodopageWithAccount from "./pages/TodopageWithAccount";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} /> */}
        <Route path="/todo_0_account" element={<TodopageWithoutAccount />} />
        <Route path="/todo_1_account" element={<TodopageWithAccount />} />
        <Route path="/report" element={<Reportpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
