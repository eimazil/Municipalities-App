import { useContext } from "react";
import ThirdContext from "../../Contexts/ThirdContext";
import Line from "./Line";

function List() {
  const { scopes } = useContext(ThirdContext);

  return (
    <div className="card m-4">
      <h5 className="card-header">Scopes List</h5>
      <div className="card-body">
        <ul className="list-group">
          {scopes?.map((s) => (
            <Line key={s.id} scope={s} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default List;
