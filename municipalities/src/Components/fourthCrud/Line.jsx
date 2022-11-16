import { useContext } from "react";
import FourthContext from "../../Contexts/FourthContext";

function Line({ suggestion }) {
  const { setEditData, setDeleteData } = useContext(FourthContext);

  return (
    <li className="list-group-item">
      <div className="home">
        <div className="home__content">
          <div className="col-12 col-sm-3">
            <h4>{suggestion.title}</h4>
            {suggestion.image ? (
              <img
                className="col-6 col-sm-12 col-lg-8"
                src={suggestion.image}
                alt={`${suggestion.title} crest`}
              ></img>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          <div className="col-12 col-sm-7 d-flex flex-column flex-md-row justify-content-between">
            <div className="col-8">
              <h5>{suggestion.name}</h5>
              <div>{suggestion.post}</div>
            </div>
            <div className="line__buttons flex-row flex-md-column gap-1 align-self-start align-self-md-center">
              <button
                style={{ display: suggestion.state === 1 ? "none" : "block" }}
                onClick={() => setEditData({ state: 1, id: suggestion.id })}
                type="button"
                className="btn btn-outline-success"
              >
                Accept
              </button>
              <button
                onClick={() => setDeleteData(suggestion)}
                type="button"
                className="btn btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Line;
