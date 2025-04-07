import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddMatchForm from "../components/AddMatch";
import "./Games.css";

const Games = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const auth = useContext(AuthContext);

  const handleSaveMatch = async (matchData) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games/add-game",
        "POST",
        JSON.stringify(matchData),
        {
          "Content-Type": "application/json",
        }
      );

      const tournamentsData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/games"
      );

      if (tournamentsData && tournamentsData.tournaments) {
        toast.success("Uspješno ste dodali utakmicu!", {
          position: "top-right",
          autoClose: 2000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournaments = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/tournaments`
        );

        setTournaments(tournaments.tournaments);

        const players = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users`
        );

        setPlayers(players.users);
      } catch (err) {}
    };

    fetchData();
  }, [sendRequest]);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <ToastContainer />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && tournaments && players && (
        <div className="admin-games-wrapper">
          {auth.isAdmin && (
            <div className="admin-panel-games">
              <AddMatchForm
                tournaments={tournaments}
                players={players}
                onSubmit={handleSaveMatch}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Games;
