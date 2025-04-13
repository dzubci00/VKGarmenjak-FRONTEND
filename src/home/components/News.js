import React from "react";
import "./News.css";
import { formatDate } from "../../shared/util/dateUtils";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Efekat zamagljenja dok se slika učitava

const News = ({ news }) => {
  return (
    <React.Fragment>
      <section className="latest-news">
        <h3 style={{ textAlign: "center" }}>Najnovije vijesti</h3>
        {news.length === 0 ? (
          <p style={{ textAlign: "center" }}>Nema dostupnih vijesti.</p>
        ) : (
          <ul>
            {news.map((item, index) => (
              <li
                className={`news-list-${index % 2 === 0 ? "odd" : "even"}`}
                key={item.id}
              >
                <div className="image-container">
                  <LazyLoadImage
                    src={`${process.env.REACT_APP_ASSET_URL}/${item.image}`}
                    alt={item.title}
                    effect="blur"
                    width="100%"
                    height="auto"
                    placeholderSrc="low-res-placeholder.jpg" // Opciona niska rezolucija slike
                  />
                </div>
                <div className="content-container">
                  <h3>{item.title}</h3>
                  <p>
                    <small>{formatDate(item.date)}</small>
                  </p>
                  <p>
                    {item.content.length > 180
                      ? item.content.substring(0, 180) + "..."
                      : item.content}
                  </p>
                  <a href={`/news/${item.id}`} className="read-more">
                    Pročitaj više
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </React.Fragment>
  );
};

export default News;
