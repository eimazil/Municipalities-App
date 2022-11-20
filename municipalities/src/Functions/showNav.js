import { useState, useEffect } from "react";
import { authConfig } from "./auth";
import Nav from "../Components/Nav";
import axios from "axios";

function ShowNav({ roleChange }) {
  const [status, setStatus] = useState(1);
  useEffect(() => {
    axios
      .get("http://localhost:3003/login-check?role=admin", authConfig())
      .then((res) => {
        setStatus(res.data.status);
      });
  }, [roleChange]);
  return <Nav status={status} />;
}

export default ShowNav;
