import { useState, useContext } from "react";
import DataContext from "../../Contexts/DataContext";
import ThirdContext from "../../Contexts/ThirdContext";

function Create() {
  const [title, setTitle] = useState("");

  const { setCreateData } = useContext(ThirdContext);
  const { makeMsg } = useContext(DataContext);

  const add = () => {
    if (title.length === 0) {
      makeMsg("Add tittle", "error");
      return;
    }
    if (title.length > 50) {
      makeMsg("Tittle is too long", "error");
      return;
    }
    setCreateData({
      title,
    });
    setTitle("");
  };

  return (
    <div className="card m-4">
      <h5 className="card-header">New scope</h5>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button onClick={add} type="button" className="btn btn-outline-success">
          Add
        </button>
      </div>
    </div>
  );
}

export default Create;
