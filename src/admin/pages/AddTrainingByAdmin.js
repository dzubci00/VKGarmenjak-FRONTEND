import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTraining from "../components/AddTraining";
import "./AddTraining.css";

const Trainings = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const handleSaveTraining = async (trainingData) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/trainings/add-training",
        "POST",
        JSON.stringify(trainingData),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      toast.success("Uspješno ste dodali trening!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Greška prilikom spremanja treninga:", err);
    }
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
      {!isLoading && (
        <div className="admin-training-wrapper">
          {auth.isAdmin && (
            <div className="admin-panel-training">
              <AddTraining onSubmit={handleSaveTraining} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Trainings;
