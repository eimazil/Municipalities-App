import { useState, useEffect, useContext } from "react";
import FourthContext from "../../Contexts/FourthContext";
import Line from "./Line";

function List() {
  const { suggestions } = useContext(FourthContext);

  const [stateFilter, setStateFilter] = useState(0);
  const [stats, setStats] = useState({ clothesCount: null });

  useEffect(() => {
    if (null === suggestions) {
      return;
    }
    setStats((s) => ({
      ...s,
      suggestionsCount: suggestions.filter((s) => s.state === stateFilter)
        .length,
    }));
  }, [suggestions, stateFilter]);

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">Suggestions ({stats.suggestionsCount})</h5>
        <div className="card-body">
          <div>
            <label className="form-label">Filter comments</label>
            <select
              className="form-select"
              onChange={(e) => setStateFilter(Number(e.target.value))}
            >
              <option value={0}>Unconfirmed</option>
              <option value={1}>Confirmed</option>
            </select>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {suggestions?.map((s, i) =>
                s.state === stateFilter ? <Line key={i} suggestion={s} /> : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default List;
