import React, { useEffect, useState } from "react";
import Results from "../components/Results";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LeagueTable from "../../home/components/LeagueTable";
import "./ValLeague.css";

const ValLeague = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);

  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentsData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/games`
        );
        setGames(tournamentsData.tournaments);

        const tournaments = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/tournaments`
        );

        setTournaments(tournaments.tournaments);

        const players = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users`
        );

        setPlayers(players.users);

        const teams = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/teams`
        );

        setTeams(teams.teams);
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
      {!isLoading && games && teams && tournaments && players && teams && (
        <div className="val-league-wrapper">
          {games && games.length > 0 && <Results games={games} />}

          {tournaments && tournaments.length > 0 && (
            <LeagueTable tournaments={tournaments} />
          )}
        </div>
      )}
    </>
  );
};

export default ValLeague;
