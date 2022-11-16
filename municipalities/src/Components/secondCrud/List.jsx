import { useContext } from "react";
import SecondContext from "../../Contexts/SecondContext";
import Line from "./Line";

function List() {
  const { municipalities } = useContext(SecondContext);

  return (
    <div className="card m-4">
      <h5 className="card-header">Municipalities List</h5>
      <div className="card-body">
        <ul className="list-group">
          {municipalities?.map((m) => (
            <Line key={m.id} municipality={m} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default List;
