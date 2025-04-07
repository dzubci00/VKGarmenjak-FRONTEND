import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Profile from "../components/Profile";
import { AuthContext } from "../../shared/context/auth-context";

const UserProfile = () => {
  const auth = useContext(AuthContext);
  const [loadedMembership, setLoadedMembership] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const [loadedTrainings, setLoadedTrainings] = useState();
  const [loadedBirthdays, setLoadedBirthdays] = useState();
  const [loadedAttendance, setLoadedAttendance] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Membership Data
        const membershipData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/membership/${userId}`
        );
        setLoadedMembership(membershipData.user); // Ensure correct data structure

        // Fetch User Data
        const userData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/user",
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setLoadedUser(userData.user);

        const userAttendance = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/trainings/attendance",
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setLoadedAttendance(userAttendance);

        const responseTrainigs = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/trainings"
        );

        setLoadedTrainings(responseTrainigs.trainings);

        const responseBirthdays = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/birthdays"
        );

        setLoadedBirthdays(responseBirthdays.players);
      } catch (err) {
        // Error handling is already covered by useHttpClient
      }
    };

    fetchData();
  }, [sendRequest, userId, auth.token]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading &&
        loadedMembership &&
        loadedUser &&
        loadedAttendance &&
        loadedTrainings && (
          <div>
            {loadedMembership &&
              loadedUser &&
              loadedAttendance &&
              loadedTrainings && (
                <Profile
                  attendance={loadedAttendance}
                  user={loadedUser}
                  membership={loadedMembership}
                  trainings={loadedTrainings}
                  birthdays={loadedBirthdays}
                  id={auth.userId}
                />
              )}
          </div>
        )}
    </React.Fragment>
  );
};

export default UserProfile;
