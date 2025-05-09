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

// ...importi ostaju isti

const Training = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [trainings, setTrainings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [expandedTrainings, setExpandedTrainings] = useState([]);

  const getTrainingStatus = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);

    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const end = new Date(start.getTime() + 90 * 60000); // +1h30m

    if (now < start) return "A"; // Aktivan
    if (now >= start && now <= end) return "UT"; // U tijeku
    return "Z"; // Završeno
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

      toast.success("Uspješno ste izbrisali trening!");
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

      toast.success("Uspješno ste se prijavili na trening!");
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

      toast.success("Uspješno ste otkazali dolazak na trening!");
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
                const status = getTrainingStatus(training.date, training.time);

                const statusLabel = {
                  A: "🕒 Uskoro",
                  UT: "⏳ U tijeku",
                  Z: "✅ Odrađen",
                }[status];

                return (
                  <li className="training-li" key={training.id}>
                    <Card className="training-item__content">
                      <p>{statusLabel}</p>
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
                          disabled={status === "Z" || status === "UT"}
                          size="small"
                          onClick={() => signUpHandler(training._id)}
                        >
                          Prijavi se
                        </Button>
                      )}

                      {auth.isLoggedIn && isSignedUp && (
                        <Button
                          disabled={status === "Z" || status === "UT"}
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
