import React, { useState, useEffect, useContext } from "react";
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
  const [formData, setFormData] = useState({
    date: "",
    time: "18:00",
    location: "",
    trainingType: "",
  });

  const showDeleteWarningHandler = (trainingId) => {
    setSelectedTrainingId(trainingId); // Postavite ID treninga koji želite izbrisati
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  /*  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Dodaj vodeće nule za dan
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Dodaj vodeće nule za mjesec (getMonth() je 0-izbiran)
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }; */

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/trainings"
        );

        setTrainings(responseData.trainings);
      } catch (err) {}
    };
    fetchTrainings();
  }, [sendRequest]);

  // Promjena inputa u formi
  const inputChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings/add-training",
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      // Ponovo učitaj sve treninge
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings"
      );

      if (responseData && responseData.trainings) {
        setTrainings(responseData.trainings);

        toast.success(`Uspešno ste dodali trening!`, {
          position: "top-right",
          autoClose: 3000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error(
          "Neispravan format odgovora nakon dodavanja treninga",
          responseData
        );
      }

      setFormData({ date: "", time: "18:00", location: "", trainingType: "" });
    } catch (err) {
      console.error("Greška prilikom dodavanja treninga:", err);
    }
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
      // Ponovo učitaj sve treninge sa servera
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings"
      );

      if (responseData && responseData.trainings) {
        setTrainings(responseData.trainings);

        toast.success(`Uspešno ste izbrisali trening!`, {
          position: "top-right",
          autoClose: 3000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error("Neispravan format odgovora nakon prijave", responseData);
      }
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

      // Ponovo učitaj sve treninge sa servera
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings"
      );

      if (responseData && responseData.trainings) {
        setTrainings(responseData.trainings);
        toast.success("Uspešno ste se prijavili na trening!", {
          position: "top-right",
          autoClose: 3000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error("Neispravan format odgovora nakon prijave", responseData);
      }
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

      // Ponovo učitaj sve treninge sa servera
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings"
      );

      if (responseData && responseData.trainings) {
        setTrainings(responseData.trainings);
        toast.success("Uspješno ste otkazali dolazak na trening!", {
          position: "top-right",
          autoClose: 3000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error("Neispravan format odgovora nakon prijave", responseData);
      }
    } catch (err) {}
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
            {auth.isAdmin && (
              <form className="training-form" onSubmit={submitHandler}>
                <h3>Dodaj Trening</h3>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={inputChangeHandler}
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={inputChangeHandler}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Lokacija"
                  value={formData.location}
                  onChange={inputChangeHandler}
                  required
                />
                <input
                  type="text"
                  name="trainingType"
                  placeholder="Tip treninga"
                  value={formData.trainingType}
                  onChange={inputChangeHandler}
                  required
                />
                <button type="submit" disabled={isLoading}>
                  Dodaj
                </button>
              </form>
            )}
            {trainings.length < 1 ? (
              <p className="center-users" style={{ textAlign: "center" }}>
                Nema dostupnih treninga
              </p>
            ) : (
              <h3>Popis Treninga</h3>
            )}
            <ul className="training-list">
              {trainings.map((training) => (
                <li className="training-li" key={training.id}>
                  <Card className={`training-item__content`}>
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
                        <>
                          <h4>
                            Prijavljeni igrači ({training.players.length})
                          </h4>
                          <ul className="prijavljeni-igraci-ul">
                            {training.players.map((player, index) => (
                              <li
                                className="prijavljeni-igraci-li"
                                key={player._id || index}
                              >
                                <Card className={`player-list-item__content`}>
                                  {player.playerId
                                    ? `${player.playerId.name} ${player.playerId.surname}`
                                    : "Nepoznati igrač"}
                                </Card>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    {/* Prikazivanje dugmadi na temelju prisutnosti igrača u listi */}
                    {auth.isLoggedIn &&
                      !training.players.some(
                        (player) =>
                          player.playerId && player.playerId._id === auth.userId
                      ) && (
                        <Button
                          size={"small"}
                          onClick={() => signUpHandler(training._id)}
                        >
                          Prijavi se
                        </Button>
                      )}

                    {auth.isLoggedIn &&
                      training.players.some(
                        (player) =>
                          player.playerId && player.playerId._id === auth.userId
                      ) && (
                        <Button
                          danger
                          size={"small"}
                          onClick={() => cancelTrainingHandler(training._id)}
                        >
                          Odjavi se
                        </Button>
                      )}

                    {auth.isLoggedIn && auth.isAdmin && (
                      <Button
                        danger
                        size={"small"}
                        onClick={() => showDeleteWarningHandler(training._id)}
                      >
                        Izbriši
                      </Button>
                    )}
                    <Modal
                      show={showConfirmModal}
                      onCancel={cancelDeleteHandler}
                      header="Are you sure?"
                      footerClass="place-item__modal-actions"
                      footer={
                        <React.Fragment>
                          <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                          </Button>
                          <Button
                            danger
                            onClick={() => confirmDeleteHandler(training._id)}
                          >
                            DELETE
                          </Button>
                        </React.Fragment>
                      }
                    >
                      <p>Želite li izbrisati trening?</p>
                    </Modal>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Training;
