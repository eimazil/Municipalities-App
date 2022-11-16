import FourthContext from "../../Contexts/FourthContext";
import List from "./List";
import { useState, useEffect } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [suggestions, setSuggestions] = useState(null);

  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3003/admin/suggestions", authConfig())
      .then((res) => {
        setSuggestions(
          res.data.map((b) => ({
            ...b,
            showMunicipalities: true,
            showScopes: true,
          }))
        );
      });
  }, [lastUpdate]);

  useEffect(() => {
    if (null === deleteData) {
      return;
    }
    axios
      .delete(
        "http://localhost:3003/admin/suggestions/" + deleteData.id,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [deleteData]);

  useEffect(() => {
    if (null === editData) {
      return;
    }
    axios
      .put(
        "http://localhost:3003/admin/suggestions/" + editData.id,
        editData,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [editData]);

  return (
    <FourthContext.Provider
      value={{
        suggestions,
        setSuggestions,
        setDeleteData,
        setEditData,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <List />
          </div>
        </div>
      </div>
    </FourthContext.Provider>
  );
}

export default Main;
