import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import VerifyOtp from "../pages/VerifyOtp/VerifyOtp";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function App() {

  return(
    <BrowserRouter>

      <Routes>

        <Route
  path="/dashboard"
  element={<Dashboard />}
/>

<Route path="/Home" element={<Home />} />


        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/verify"
          element={<VerifyOtp />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;