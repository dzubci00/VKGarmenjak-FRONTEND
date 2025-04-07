import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddUser from "../components/AddUser";
import "./AddUserByAdmin.css";

const AddUserByAdmin = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [unregisteredUsers, setUnregisteredUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleSaveUser = async (userData) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("surname", userData.surname);
      formData.append("birthDate", userData.birthDate);
      formData.append("role", userData.role);
      formData.append("position", userData.position);
      formData.append("image", userData.image);

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/addUser",
        "POST",
        formData,
        {}
      );

      // Optimistički dodajemo korisnika u lokalnu listu bez potrebe za novim zahtevom
      setUnregisteredUsers((prevUsers) => [
        ...prevUsers,
        {
          name: userData.name,
          surname: userData.surname,
          birthDate: userData.birthDate,
          role: userData.role,
          position: userData.position,
          image: userData.image,
        },
      ]);

      toast.success("Uspješno ste dodali korisnika!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unregisterdUsers = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/unregistered-users`
        );

        setUnregisteredUsers(unregisterdUsers.users);

        const registeredUsers = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/`
        );

        setRegisteredUsers(registeredUsers.users);
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
      {!isLoading && unregisteredUsers && (
        <div className="admin-user-wrapper">
          <div className="admin-panel-users">
            <AddUser onSubmit={handleSaveUser} />
          </div>
          <div className="korisnici">
            <div className="korisnici-card">
              <h3>Registrirani korisnici:</h3>
              {registeredUsers
                .sort((a, b) => a.name.localeCompare(b.name)) // Sortiranje po imenu
                .map((user) => (
                  <p key={user.id}>
                    {" "}
                    <strong>
                      {user.name} {user.surname}
                    </strong>{" "}
                    {user.role === "admin" ? "🤽🏼‍♂️ 🛠️" : "🤽🏼‍♂️"}
                    {" - "}
                    {user.position}
                  </p>
                ))}
            </div>
            <div className="korisnici-card">
              <h3>Neregistrirani korisnici:</h3>
              {unregisteredUsers
                .sort((a, b) => a.name.localeCompare(b.name)) // Sortiranje po imenu
                .map((user) => (
                  <p key={user.id}>
                    {" "}
                    <strong>
                      {user.name} {user.surname}
                    </strong>{" "}
                    {user.role === "admin" ? "🤽🏼‍♂️ 🛠️" : "🤽🏼‍♂️"}
                    {" - "}
                    {user.position}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUserByAdmin;
