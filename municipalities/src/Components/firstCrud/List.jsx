import { useState, useEffect, useContext } from "react";
import DataContext from "../../Contexts/DataContext";
import FirstContext from "../../Contexts/FirstContext";
import Line from "./Line";

function List() {
  const {
    municipalities,
    scopes,
    setSuggestionData,
    suggestions,
    setSuggestions,
  } = useContext(FirstContext);

  const { makeMsg } = useContext(DataContext);

  const [post, setPost] = useState("");
  const [stats, setStats] = useState({ clothesCount: null });
  const [suggestionMunicipality, setSuggestionMunicipality] = useState(0);
  const [suggestionScope, setSuggestionScope] = useState(0);

  const [filterMunicipalities, setFilterMunicipalities] = useState(0);
  const [filterScope, setFilterScope] = useState(0);

  const add = () => {
    if (suggestionMunicipality === 0) {
      makeMsg("Choose a municipality!");
      return;
    }
    if (suggestionScope === 0) {
      makeMsg("Choose a problem area!");
      return;
    }
    if (post.length === 0) {
      makeMsg("Suggestion text field cannot be empty!");
      return;
    }
    if (post.length > 500) {
      makeMsg("Suggestion cannot exceed 500 characters");
      return;
    }
    setSuggestionData({
      post,
      municipality_id: parseInt(suggestionMunicipality),
      scope_id: parseInt(suggestionScope),
    });
    setPost("");
    setSuggestionMunicipality(0);
    setSuggestionScope(0);
  };

  useEffect(() => {
    if (null === suggestions) {
      return;
    }
    setStats((s) => ({
      ...s,
      suggestionsCount: suggestions?.filter(
        (s) =>
          s.showMunicipalities === true &&
          s.showScopes === true &&
          s.state === 1
      ).length,
    }));
  }, [suggestions]);

  useEffect(() => {
    if (filterMunicipalities === 0) {
      setSuggestions((s) =>
        s?.map((suggestion) => ({ ...suggestion, showMunicipalities: true }))
      );
    } else {
      setSuggestions((s) =>
        s?.map((suggestion) =>
          suggestion.municipality_id === filterMunicipalities
            ? { ...suggestion, showMunicipalities: true }
            : { ...suggestion, showMunicipalities: false }
        )
      );
    }
  }, [filterMunicipalities, setSuggestions]);

  useEffect(() => {
    if (filterScope === 0) {
      setSuggestions((s) =>
        s?.map((suggestion) => ({ ...suggestion, showScopes: true }))
      );
    } else {
      setSuggestions((s) =>
        s?.map((suggestion) =>
          suggestion.scope_id === filterScope
            ? { ...suggestion, showScopes: true }
            : { ...suggestion, showScopes: false }
        )
      );
    }
  }, [filterScope, setSuggestions]);

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">New suggestion</h5>
        <div className="card-body">
          <div className="d-flex flex-column flex-sm-row gap-2">
            <div className="">
              <label className="form-label">Pick municipality</label>
              <select
                className="form-select"
                value={suggestionMunicipality}
                onChange={(e) => setSuggestionMunicipality(e.target.value)}
              >
                <option value={0} disabled>
                  Choose from list
                </option>
                {municipalities?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Pick area of concern</label>
              <select
                className="form-select"
                value={suggestionScope}
                onChange={(e) => setSuggestionScope(e.target.value)}
              >
                <option value={0} disabled>
                  Choose from list
                </option>
                {scopes?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            className="form-control my-2"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          ></textarea>
          <button
            onClick={add}
            type="button"
            className="btn btn-outline-success"
          >
            Add
          </button>
        </div>
      </div>
      <div className="card m-4">
        <h5 className="card-header">Suggestions ({stats.suggestionsCount})</h5>
        <div className="card-body">
          <div className="d-flex flex-column flex-sm-row gap-2">
            <div>
              <label className="form-label">Sort by Municipality</label>
              <select
                className="form-select"
                onChange={(e) =>
                  setFilterMunicipalities(Number(e.target.value))
                }
              >
                <option value={0}>Choose from list</option>
                {municipalities?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Sort by Issue</label>
              <select
                className="form-select"
                onChange={(e) => setFilterScope(Number(e.target.value))}
              >
                <option value={0}>Choose from list</option>
                {scopes?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {suggestions?.map((s, i) =>
                s.showMunicipalities === true &&
                s.showScopes === true &&
                s.state === 1 ? (
                  <Line key={i} suggestion={s} />
                ) : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default List;
