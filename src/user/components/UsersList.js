import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const positionOrder = ["Napadač", "Bek", "Centar", "Golman"];

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <p className="center-users" style={{ textAlign: "center" }}>
        Nema dostupnih igrača.
      </p>
    );
  }

  // Grupiranje igrača po pozicijama
  const groupedPlayers = props.items.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {});

  return (
    <div className="users-list">
      {positionOrder.map((position) =>
        groupedPlayers[position] ? (
          <div key={position} className="group">
            <h3>{position}</h3>
            <ul>
              {groupedPlayers[position].map((user, index) => (
                <UserItem
                  key={user._id}
                  id={user._id}
                  image={user.image}
                  name={user.name}
                  surname={user.surname}
                  position={user.position}
                  goals={user.goals}
                  assists={user.assists}
                  saves={user.saves}
                  matches={user.matchesPlayed}
                  isEven={index % 2 === 0}
                />
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
};

export default UsersList;
