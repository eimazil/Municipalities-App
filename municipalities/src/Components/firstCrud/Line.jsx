function Line({ suggestion }) {
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
          <div className="col-12 col-sm-8 ">
            <h5>{suggestion.name}</h5>
            <div>{suggestion.post}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Line;
