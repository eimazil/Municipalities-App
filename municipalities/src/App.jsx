import "./App.scss";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Nav from "./Components/Nav";
import { login, logout, authConfig } from "./Functions/auth";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DataContext from "./Contexts/DataContext";
import { v4 as uuidv4 } from "uuid";
import Messages from "./Components/Messages";

// Main screen imports
import FirstCrud from "./Components/firstCrud/Main";
import SecondCrud from "./Components/secondCrud/Main";
import ThirdCrud from "./Components/thirdCrud/Main";
import FourthCrud from "./Components/fourthCrud/Main";
// import RegisterPage from "./Components/register/Main";

function App() {
  const [roleChange, setRoleChange] = useState(Date.now());

  const [msgs, setMsgs] = useState([]);

  const makeMsg = useCallback((text) => {
    const msg = {
      id: uuidv4(),
      text,
    };
    setMsgs((m) => [...m, msg]);
    setTimeout(() => {
      setMsgs((m) => m.filter((mes) => mes.id !== msg.id));
    }, 4000);
  }, []);

  return (
    <DataContext.Provider
      value={{
        msgs,
        setMsgs,
        makeMsg,
      }}
    >
      <BrowserRouter>
        <ShowNav roleChange={roleChange} />
        <Messages />
        <Routes>
          <Route
            path="/"
            element={
              // <RequireAuth role="user">
              <FirstCrud />
              // </RequireAuth>
            }
          ></Route>
          <Route
            path="/secondLink"
            element={<RequireAuth role="admin">{<SecondCrud />}</RequireAuth>}
          />
          <Route
            path="/thirdLink"
            element={<RequireAuth role="admin">{<ThirdCrud />}</RequireAuth>}
          />
          <Route
            path="/fourthLink"
            element={<RequireAuth role="admin">{<FourthCrud />}</RequireAuth>}
          ></Route>
          <Route
            path="/login"
            element={<LoginPage setRoleChange={setRoleChange} />}
          />
          <Route
            path="/logout"
            element={<LogoutPage setRoleChange={setRoleChange} />}
          />
          {/* <Route
            path="/register"
            element={<RegisterPage setRoleChange={setRoleChange} />}
          /> */}
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

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
          setView(<Navigate to="/" replace />);
        }
      });
  }, [children, role]);

  return view;
}

function LoginPage({ setRoleChange }) {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const doLogin = () => {
    axios.post("http://localhost:3003/login", { user, pass }).then((res) => {
      setRoleChange(Date.now());
      if ("ok" === res.data.msg) {
        login(res.data.key);
        navigate("/", { replace: true });
      }
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 ">
          <div className="card m-4">
            <h5 className="card-header">Login</h5>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">name</label>
                <input
                  type="text"
                  className="form-control"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">password</label>
                <input
                  type="password"
                  className="form-control"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <button
                onClick={doLogin}
                type="button"
                className="btn btn-outline-success"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoutPage({ setRoleChange }) {
  useEffect(() => {
    logout();
    setRoleChange(Date.now());
  }, [setRoleChange]);

  return <Navigate to="/" replace />;
}

export default App;
