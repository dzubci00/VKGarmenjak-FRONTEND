import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
  return ReactDOM.createPortal(
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h3>{props.header}</h3>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>,
    document.getElementById("modal-hook")
  );
};

const Modal = (props) => {
  const nodeRef = useRef(null); // Create a ref for the modal

  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={0}
        classNames="modal"
        nodeRef={nodeRef} // Pass nodeRef to CSSTransition
      >
        <div ref={nodeRef}>
          {" "}
          {/* Assign ref to the wrapper element */}
          <ModalOverlay {...props} />
        </div>
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
