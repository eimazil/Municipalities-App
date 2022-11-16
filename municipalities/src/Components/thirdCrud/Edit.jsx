import { useContext, useEffect, useState } from "react";
import ThirdContext from "../../Contexts/ThirdContext";
import DataContext from "../../Contexts/DataContext";

function Edit() {
  const [title, setTitle] = useState("");

  const { setEditData, modalData, setModalData } = useContext(ThirdContext);
  const { makeMsg } = useContext(DataContext);

  const edit = () => {
    if (title.length === 0) {
      makeMsg("Add tittle", "error");
      return;
    }
    if (title.length > 50) {
      makeMsg("Tittle is too long", "error");
      return;
    }

    setEditData({
      title,
      id: modalData.id,
    });
    setModalData(null);
  };

  useEffect(() => {
    if (null === modalData) {
      return;
    }
    setTitle(modalData.title);
  }, [modalData]);

  if (null === modalData) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit scope</h5>
            <button
              onClick={() => setModalData(null)}
              type="button"
              className="btn-close"
            ></button>
          </div>
          <div className="modal-body"></div>
          <div className="card m-4">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Scope name</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <button
                onClick={edit}
                type="button"
                className="btn btn-outline-success"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
