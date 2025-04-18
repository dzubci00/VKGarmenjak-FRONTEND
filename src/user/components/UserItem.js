import React from "react";
import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className={`user-item__content ${props.isEven ? "even" : "odd"}`}>
        <div className="user-item-top">
          <div className="user-item-name-surname">
            <h4>{props.name}</h4>
            <h4>{props.surname}</h4>
          </div>
          <div className="user-item__image">
            <Avatar
              image={`${
                process.env.REACT_APP_ASSET_URL === "http://localhost:5000"
                  ? process.env.REACT_APP_ASSET_URL + "/"
                  : ""
              }${props.image}`}
              alt={props.name}
            />
          </div>
        </div>
        <div className="user-item-bottom">
          {/* <p style={{ color: "#020659" }}>{props.position}</p> */}

          {props.position === "Golman" ? (
            <p>Obrane: {props.saves}</p>
          ) : (
            <>
              <p>Golovi: {props.goals}</p>
              <p>Asistencije: {props.assists}</p>
            </>
          )}

          <p>Odigrane utakmice: {props.matches}</p>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;
