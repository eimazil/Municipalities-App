import FirstContext from "../../Contexts/FirstContext";
import List from "./List";
import { useState, useEffect } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [municipalities, setMunicipalities] = useState(null);
  const [scopes, setScopes] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestionData, setSuggestionData] = useState(null);

  // READ for list
  useEffect(() => {
    axios.get("http://localhost:3003/home/municipalities").then((res) => {
      setMunicipalities(res.data);
    });
  }, [lastUpdate]);

  useEffect(() => {
    axios.get("http://localhost:3003/home/scopes").then((res) => {
      setScopes(res.data);
    });
  }, [lastUpdate]);

  useEffect(() => {
    if (null === suggestionData) {
      return;
    }
    axios
      .post(
        "http://localhost:3003/home/suggestions",
        suggestionData,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [suggestionData]);

  useEffect(() => {
    axios.get("http://localhost:3003/home/suggestions").then((res) => {
      setSuggestions(
        res.data.map((b) => ({
          ...b,
          showMunicipalities: true,
          showScopes: true,
        }))
      );
    });
  }, [lastUpdate]);

  return (
    <FirstContext.Provider
      value={{
        municipalities,
        scopes,
        setSuggestionData,
        suggestions,
        setSuggestions,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <List />
          </div>
        </div>
      </div>
    </FirstContext.Provider>
  );
}

export default Main;
