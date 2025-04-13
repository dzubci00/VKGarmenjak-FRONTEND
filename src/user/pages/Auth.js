import React, { useState, useContext, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../shared/components/UIElements/Modal";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginmModal, setLoginmModal] = useState(false);
  const history = useHistory();

  const closeModalHandler = () => {
    setShowConfirmModal(false);
    history.push("/auth");
  };

  const closeLoginModalHandler = () => {
    setLoginmModal(false);
  };

  const sendVerificationMailHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/resend-verification",
        "POST",
        JSON.stringify({ email: formState.inputs.email.value }),
        { "Content-Type": "application/json" }
      );

      toast.success(
        `Uspješno poslan verifikacijski mail na adresu: ${formState.inputs.email.value}!`,
        {
          position: "top-right",
          autoClose: 3000, // Automatski zatvori za 3 sekunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setLoginmModal(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (showConfirmModal) {
      const timer = setTimeout(() => {
        setShowConfirmModal(false);
      }, 5000); // Zatvara modal nakon 5 sekundi
      return () => clearTimeout(timer);
    }
  }, [showConfirmModal]);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          surname: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          surname: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        if (!responseData.isVerified) {
          setLoginmModal(true);
          return;
        }
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.isAdmin
        );
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("surname", formState.inputs.surname.value);
        formData.append("password", formState.inputs.password.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            name: formState.inputs.name.value,
            surname: formState.inputs.surname.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        if (!responseData.isVerified) {
          setShowConfirmModal(true);
        } else {
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.isAdmin
          );
        }
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <ToastContainer />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="authentication">
        <h3>Potrebna je prijava</h3>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Ime"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Molimo unesite ime."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="surname"
              type="text"
              label="Prezime"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Molimo unesite prezime."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Molimo unesite ispravnu E-mail adresu."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Lozinka"
            autoComplete="current-password webauthn"
            validators={[VALIDATOR_MINLENGTH(4)]}
            errorText="Molimo unesite ispravnu lozinku, minimalno 4 znaka."
            onInput={inputHandler}
          />
          <Button join type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "PRIJAVA" : "REGISTRIRACIJA"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          IDI NA {isLoginMode ? "REGISTRIRACIJU" : "PRIJAVU"}
        </Button>
      </Card>
      <Modal
        show={showConfirmModal}
        onCancel={closeModalHandler}
        header="Verifikacijski mail"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeModalHandler}>
              Zatvori
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Poslan je verifikacijski mail. <br />
          Potvrdite svoju e-mail adresu putem linka u poruci kako biste mogli
          pristupiti aplikaciji.
        </p>
        <p>
          Ako niste primili e-mail, provjerite **spam** ili **junk** folder.
        </p>
      </Modal>

      <Modal
        show={showLoginmModal}
        onCancel={closeLoginModalHandler}
        header="Verifikacijski mail"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeLoginModalHandler}>
              Zatvori
            </Button>
            <Button inverse onClick={sendVerificationMailHandler}>
              Pošalji
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Mail nije verificiran!
          <br />
          Provjerite svoju poštu ili zatražite ponovno slanje verifikacijskog
          mail-a klikom na Pošalji.
        </p>
      </Modal>
    </React.Fragment>
  );
};

export default Auth;
