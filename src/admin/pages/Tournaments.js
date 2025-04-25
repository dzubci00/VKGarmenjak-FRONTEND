import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTournament from "../components/AddTournament";
import "./Tournaments.css";

const Tournaments = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tournaments, setTournaments] = useState([]);
  const auth = useContext(AuthContext);
  const [teams, setTeams] = useState([]);

  const handleSaveTournament = async (tournamentData) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/tournaments/add-tournament-teams",
        "POST",
        JSON.stringify(tournamentData),
        {
          "Content-Type": "application/json",
        }
      );

      const tournamentsData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/tournaments"
      );

      if (tournamentsData && tournamentsData.tournaments) {
        setTournaments(tournamentsData.tournaments);
        toast.success("Uspješno ste dodali turnir!", {
          position: "top-right",
          autoClose: 2000, // Automatski zatvori za 2 sekunde
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
      <ToastContainer />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && tournaments && (
        <div className="admin-tournament-wrapper">
          {auth.isAdmin && (
            <div className="admin-panel-tournament">
              <AddTournament teams={teams} onSubmit={handleSaveTournament} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Tournaments;
