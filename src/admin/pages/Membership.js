import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Membership.css";

const Membership = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const auth = useContext(AuthContext);

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
        <div className="admin-membership-wrapper">
          {auth.isAdmin && (
            <>
              <p>Resetiraj godišnje članarine</p>
              <p>Resetiraj članarine za suce</p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Membership;
