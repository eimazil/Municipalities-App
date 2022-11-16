import axios from "axios";

export const login = (key, id) => {
  localStorage.setItem("session", key);

  axios.get("http://localhost:3003/login/" + key, authConfig()).then((res) => {
    localStorage.setItem("id", res.data[0].id);
  });
};
export const logout = () => {
  localStorage.removeItem("session");
  localStorage.removeItem("id");
};

export const authConfig = () => {
  return {
    headers: { Authorization: `${localStorage.getItem("session") ?? ""}` },
  };
};
