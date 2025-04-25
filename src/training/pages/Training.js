import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Training.css";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { formatDate } from "../../shared/util/dateUtils";

const Training = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [trainings, setTrainings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [expandedTrainings, setExpandedTrainings] = useState([]);

  const isTrainingInPast = (date, time) => {
    // Izvuci samo datum (YYYY-MM-DD) iz ISO stringa
    const dateOnly = new Date(date).toISOString().split("T")[0];

    // Parsiraj komponente
    const [year, month, day] = dateOnly.split("-");
    const [hours, minutes] = time.split(":");

    const trainingDateTime = new Date(year, month - 1, day, hours, minutes);

    return new Date() > trainingDateTime;
  };

  const getTrainingStatusEmoji = (date, time) => {
    const dateOnly = new Date(date).toISOString().split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const [hours, minutes] = time.split(":");

    const trainingDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    const diffInMs = trainingDateTime - now;
    var diffInMinutes = diffInMs / (1000 * 60);
    diffInMinutes = diffInMinutes * -1;

    if (diffInMinutes >= 90) return "✅ Odrađen";
    if (diffInMinutes <= 60 && diffInMinutes >= 0) return "⏳ U tijeku";
    return "🕒 Uskoro";
  };

  const fetchTrainings = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings"
      );
      setTrainings(responseData.trainings);
    } catch (err) {}
  }, [sendRequest]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const showDeleteWarningHandler = (trainingId) => {
    setSelectedTrainingId(trainingId);
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/trainings/${selectedTrainingId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      await fetchTrainings();

      toast.success("Uspješno ste izbrisali trening!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {}
  };

  const signUpHandler = async (trainingId) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/trainings/signup/${trainingId}`,
        "PATCH",
        null,
        { Authorization: `Bearer ${auth.token}` }
      );
      await fetchTrainings();

      toast.success("Uspješno ste se prijavili na trening!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {}
  };

  const cancelTrainingHandler = async (trainingId) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/trainings/cancel/${trainingId}`,
        "PATCH",
        null,
        { Authorization: `Bearer ${auth.token}` }
      );
      await fetchTrainings();

      toast.success("Uspješno ste otkazali dolazak na trening!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {}
  };

  const toggleTrainingExpansion = (trainingId) => {
    setExpandedTrainings((prevExpanded) =>
      prevExpanded.includes(trainingId)
        ? prevExpanded.filter((id) => id !== trainingId)
        : [...prevExpanded, trainingId]
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <ToastContainer />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && trainings && (
        <div className="wrap-training">
          <div className="training-container">
            {trainings.length < 1 ? (
              <p className="center-users" style={{ textAlign: "center" }}>
                Nema dostupnih treninga
              </p>
            ) : (
              <h3 style={{ marginBottom: "5px" }}>Treninzi:</h3>
            )}

            <ul className="training-list">
              {trainings.map((training) => {
                const isSignedUp = training.players.some(
                  (player) =>
                    player.playerId && player.playerId._id === auth.userId
                );
                const isExpanded = expandedTrainings.includes(training._id);

                return (
                  <li className="training-li" key={training.id}>
                    <Card className="training-item__content">
                      <p>
                        {getTrainingStatusEmoji(training.date, training.time)}
                      </p>
                      <div className="content">
                        <p>
                          <strong>Datum:</strong> {formatDate(training.date)}
                        </p>
                        <p>
                          <strong>Vrijeme:</strong> {training.time}
                        </p>
                        <p>
                          <strong>Lokacija:</strong> {training.location}
                        </p>
                        <p>
                          <strong>Tip:</strong> {training.trainingType}
                        </p>
                        {training.players.length === 0 ? (
                          <h4>Nema prijavljenih igrača</h4>
                        ) : (
                          <h4
                            onClick={() =>
                              toggleTrainingExpansion(training._id)
                            }
                            style={{ marginTop: "15px", cursor: "pointer" }}
                          >
                            Prijavljeni igrači ({training.players.length})
                          </h4>
                        )}
                        {isExpanded &&
                          (training.players.length === 0 ? (
                            <p style={{ marginTop: "10px" }}>-</p>
                          ) : (
                            <ul className="prijavljeni-igraci-ul">
                              {training.players.map((player, index) => (
                                <li
                                  className="prijavljeni-igraci-li"
                                  key={player._id || index}
                                >
                                  <Card className="player-list-item__content">
                                    {player.playerId
                                      ? `${player.playerId.name} ${player.playerId.surname}`
                                      : "Nepoznati igrač"}
                                  </Card>
                                </li>
                              ))}
                            </ul>
                          ))}
                      </div>

                      {auth.isLoggedIn && !isSignedUp && (
                        <Button
                          disabled={isTrainingInPast(
                            training.date,
                            training.time
                          )}
                          size="small"
                          onClick={() => signUpHandler(training._id)}
                        >
                          Prijavi se
                        </Button>
                      )}

                      {auth.isLoggedIn && isSignedUp && (
                        <Button
                          disabled={isTrainingInPast(
                            training.date,
                            training.time
                          )}
                          danger
                          size="small"
                          onClick={() => cancelTrainingHandler(training._id)}
                        >
                          Odjavi se
                        </Button>
                      )}

                      {auth.isLoggedIn && auth.isAdmin && (
                        <Button
                          danger
                          size="small"
                          onClick={() => showDeleteWarningHandler(training._id)}
                        >
                          Izbriši
                        </Button>
                      )}
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Jeste li sigurni?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Odustani
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Izbriši
            </Button>
          </>
        }
      >
        <p>Želite li izbrisati trening?</p>
      </Modal>
    </>
  );
};

export default Training;
