import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import News from "../components/News";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "../components/Home.css";
import LeagueTable from "../components/LeagueTable";
import Footer from "../../shared/components/footer/Footer";
import Sponsors from "../components/Sponsors";
import FeaturedPlayers from "../components/FeaturedPlayers";

const Home = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tournaments, setTournaments] = useState([]);
  const [news, setLoadedNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/tournaments"
        );
        setTournaments(tableData.tournaments);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/news"
        );

        setLoadedNews(responseData.news);
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && tournaments && news && (
        <div className="body">
          <Hero />
          <div className="home-wrapper">
            <News news={news} />
            <FeaturedPlayers></FeaturedPlayers>
            <LeagueTable tournaments={tournaments} />
          </div>
          <Sponsors />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
