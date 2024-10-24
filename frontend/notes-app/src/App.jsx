import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import "./index.css";
import Modal from "react-modal";

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);
// function App() {
//   return (
//     <div>
//       {routes}
//       {/* <Home />
//       <Login />
//       <SignUp /> */}
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/dashboard" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//       </Routes>
//     </Router>
//   );
// }
Modal.setAppElement("#root");

const App = () => {
  return <div>{routes}</div>;
};

export default App;
