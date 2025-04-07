import React, { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { AuthContext } from "../../shared/context/auth-context";
import { formatDate } from "../../shared/util/dateUtils";
import "./Results.css";

const Results = ({ games }) => {
  const auth = useContext(AuthContext);

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Turniri</h3>
      <div className="tournament-table">
        {games.map((tournament) => (
          <div key={tournament.name} className="tournament">
            <h3>
              {tournament.name} {formatDate(tournament.date)}
            </h3>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "#f0f0f0",
                color: "#333",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#D7D7D7" }}>
                    <TableCell
                      sx={{
                        color: "white",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                    >
                      Faza
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      align="center"
                    >
                      Domaćin
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      align="center"
                    >
                      Rezultat
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      align="center"
                    >
                      Gost
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "white",
                        fontFamily: "'Open Sans', sans-serif",
                      }}
                      /* align="center" */
                    >
                      Igrači
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tournament.games.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          color: "#000",
                          fontFamily: "'Open Sans', sans-serif",
                        }}
                      >
                        {game.phase}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#000",
                          fontFamily: "'Open Sans', sans-serif",
                        }}
                        align="center"
                      >
                        {/*  {game.homeTeam === "VK Garmenjak" ? (
                        <strong>{game.homeTeam}</strong>
                      ) : (
                        <>{game.homeTeam}</>
                      )} */}
                        {game.homeTeam}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#000",
                          fontFamily: "'Open Sans', sans-serif",
                        }}
                        align="center"
                      >
                        <strong>{game.score}</strong>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#000",
                          fontFamily: "'Open Sans', sans-serif",
                        }}
                        align="center"
                      >
                        {/* {game.awayTeam === "VK Garmenjak" ? (
                        <strong>{game.awayTeam}</strong>
                      ) : (
                        <>{game.awayTeam}</>
                      )} */}
                        {game.awayTeam}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#000",
                          fontFamily: "'Open Sans', sans-serif",
                        }}
                      >
                        {game.playerStats
                          .slice() // Pravimo kopiju da ne bismo menjali originalni niz
                          .filter(
                            (player) => player.goals > 0 || player.assists > 0
                          ) // Uklanjamo igrače sa 0 golova i 0 asistencija
                          .sort((a, b) => b.goals - a.goals) // Sortiramo opadajuće prema broju golova
                          .map((player, i) => (
                            <div key={i}>
                              {player.playerId.id === auth.userId ? (
                                <strong>
                                  {player.playerId.name}{" "}
                                  {player.playerId.surname} {player.goals}🏐{" "}
                                  {player.assists}🎯
                                </strong>
                              ) : (
                                <>
                                  {player.playerId.name}{" "}
                                  {player.playerId.surname} {player.goals}🏐{" "}
                                  {player.assists}🎯
                                </>
                              )}
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </div>
    </>
  );
};

export default Results;
