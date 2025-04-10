import React, { useEffect, useState } from "react";
import "./News.css";
import { formatDate } from "../../shared/util/dateUtils";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Efekat zamagljenja dok se slika učitava

const News = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [news, setLoadedNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/news/"
        );

        setLoadedNews(responseData.news);
      } catch (err) {}
    };
    fetchNews();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && news && (
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
      )}
    </React.Fragment>
  );
};

export default News;
