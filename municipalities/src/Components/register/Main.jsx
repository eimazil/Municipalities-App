import { useState, useEffect } from "react";
import Register from "../../Contexts/Register";
import Create from "./Create";
import axios from "axios";
import { authConfig } from "../../Functions/auth";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const [createUser, setCreateUser] = useState(null);

  useEffect(() => {
    if (null === createUser) {
      return;
    }
    axios
      .post("http://localhost:3003/register", createUser, authConfig())
      .then((res) => {
        navigate("/login", { replace: true });
      });
  }, [createUser, navigate]);

  return (
    <Register.Provider
      value={{
        setCreateUser,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Create />
          </div>
        </div>
      </div>
    </Register.Provider>
  );
}
export default Main;
