import React, { useState, useEffect } from "react";
import "./Profile.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import PaymentBarcode from "./PaymentBarcode";

const Profile = ({
  attendance,
  user,
  membership,
  trainings,
  id,
  birthdays,
}) => {
  const [notifications, setNotifications] = useState([]);

  // Uvoz NavLink

  useEffect(() => {
    const newNotifications = [];

    if (!membership.membershipPaid) {
      newNotifications.push("⚠️ Niste platili godišnju članarinu.");
    }

    if (birthdays.length > 0) {
      newNotifications.push(
        <>
          <ul>
            {birthdays.map((player) => (
              <li key={player._id}>
                🎂 Naš {player.position}{" "}
                <b>
                  {player.name} {player.surname}{" "}
                </b>
                danas ima rođendan!
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (trainings.length > 0) {
      const unregisteredTrainings = trainings.filter((t) => {
        const isUserRegistered = t.players.some(
          (player) => player.playerId._id === id
        );

        // Uključi samo treninge sa statusom "A" (aktivan)
        return t.status === "A" && !isUserRegistered;
      });

      if (unregisteredTrainings.length > 0) {
        newNotifications.push(
          <span>
            📅 Postoje treninzi na koje se još niste prijavili.{" "}
            <NavLink to="/trainings">
              <Button forma size="small">
                Pogledaj treninge
              </Button>
            </NavLink>
          </span>
        );
      }
    }

    // Provjera prisutnosti na treninzima
    if (attendance.attendanceCount / attendance.totalTrainings < 0.5) {
      newNotifications.push(
        "📉 Vaša prisutnost na treninzima ovaj mjesec je ispod 50%."
      );
    }

    setNotifications(newNotifications);
  }, [attendance, membership, trainings, id, birthdays]);

  const rows = [
    {
      type: "Godišnja članarina",
      paid: membership.membershipPaid,
      fee: membership.membershipFee,
    },
    {
      type: "Članarina za suca",
      paid: membership.refereeMembershipPaid,
      fee: membership.refereeMembershipFee,
    },
  ];

  const prosjekGolova =
    user.matchesPlayed > 0
      ? (user.goals / user.matchesPlayed).toFixed(2)
      : "0.00";
  const prosjekAsistencija =
    user.matchesPlayed > 0
      ? (user.assists / user.matchesPlayed).toFixed(2)
      : "0.00";

  const code = `HRVHUB30
                EUR
                0000000000+${membership.membershipFee}+00



                VATERPOLO KLUB GARMENJAK
                OBALA TAMARISA 6
                PAŠMAN
                HR9624070001100239255
                HR00


                ${membership.name} ${membership.surname}, Članarina`;

  return (
    <div className="profile-wraper">
      <div className="top">
        <div className="profile">
          <div className="proile-top">
            <div className="name-surname-mail">
              <h3>
                🤽🏼‍♂️ {user.name} {user.surname}
              </h3>
              {/* <h4>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</h4> */}
              <div className="profile-bottom">
                <p>
                  Tip članstva:{" "}
                  {membership.membershipType.charAt(0).toUpperCase() +
                    membership.membershipType.slice(1)}
                </p>
                <p>Pozicija: {user.position}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="statistika">
          <h3>📊 Statistika</h3>
          <p>
            <strong>Golovi:</strong> {user.goals}
          </p>
          <p>
            <strong>Asistencije:</strong> {user.assists}
          </p>
          <p>
            <strong>Utakmice:</strong> {user.matchesPlayed}
          </p>
          <p>
            <strong>Gol/Ut:</strong> {prosjekGolova}
          </p>
          <p>
            <strong>Asist/Ut:</strong> {prosjekAsistencija}
          </p>
          <p>
            <strong>Dolasci na treninge:</strong> {attendance.attendanceCount}/
            {attendance.totalTrainings}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="notifications">
            <h3>📢 Obavijesti</h3>
            <ul>
              {notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="membership-table">
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#f0f0f0",
            color: "#333",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#D7D7D7" }}>
                <TableCell
                  sx={{ color: "white", fontFamily: "'Open Sans', sans-serif" }}
                >
                  Tip članarine
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontFamily: "'Open Sans', sans-serif" }}
                  align="center"
                >
                  Plaćeno
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontFamily: "'Open Sans', sans-serif" }}
                  align="center"
                >
                  Iznos
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        color: "#000",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      {row.type.trim()}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: row.paid ? "black" : "black",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      align="center"
                    >
                      {row.paid ? "✅ Da" : "❌ Ne"}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#000",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      align="center"
                    >
                      {row.fee}€
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      color: "#666",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    Nema dostupnih podataka
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!membership.membershipPaid ? (
          <div className="membership-barcode" style={{}}>
            <h4 style={{ marginBottom: "10px", color: "#333" }}>
              Plati članarinu putem koda
            </h4>
            <PaymentBarcode paymentData={code} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
