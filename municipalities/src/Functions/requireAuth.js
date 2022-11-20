import { useState, useEffect } from "react";
import { authConfig } from "./auth";
import { Navigate } from "react-router-dom";
import axios from "axios";

function RequireAuth({ children, role }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);

  useEffect(() => {
    axios
      .get("http://localhost:3003/login-check?role=" + role, authConfig())
      .then((res) => {
        if ("ok" === res.data.msg) {
          setView(children);
        } else if (res.data.status === 2) {
          setView(<h2>Unauthorize...</h2>);
        } else {
          setView(<Navigate to="/login" replace />);
        }
      });
  }, [children, role]);

  return view;
}

export default RequireAuth;
