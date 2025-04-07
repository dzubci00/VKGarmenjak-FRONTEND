import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./LeagueTable.css";

const LeagueTable = ({ tournaments }) => {
  const turniri = tournaments.map((tournament) => tournament.name); // Dinamički nazivi turnira

  // Pravljenje strukture podataka za ekipe
  const teamsMap = new Map(); // Map objekat za praćenje ekipa i njihovih bodova

  tournaments.forEach((tournament, tIndex) => {
    tournament.standings.forEach(({ teamId, points }) => {
      if (!teamsMap.has(teamId._id)) {
        teamsMap.set(teamId._id, {
          _id: teamId._id,
          teamName: teamId.teamName,
          pointsPerTournament: Array(tournaments.length).fill(0), // Prazan niz za bodove
        });
      }
      teamsMap.get(teamId._id).pointsPerTournament[tIndex] = points; // Dodajemo bodove u odgovarajući turnir
    });
  });

  // Konverzija iz Map u niz i sortiranje ekipa
  const sortedTeams = Array.from(teamsMap.values())
    .map((team) => ({
      ...team,
      totalPoints: team.pointsPerTournament.reduce((sum, pts) => sum + pts, 0),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints); // Sortiramo prema ukupnim bodovima

  // Dodajemo pozicije ekipama
  let currentPosition = 1;
  let lastTotalPoints = null;
  const rankedTeams = sortedTeams.map((team, index) => {
    if (team.totalPoints !== lastTotalPoints) {
      lastTotalPoints = team.totalPoints;
      currentPosition = index + 1;
    }
    return { ...team, position: currentPosition };
  });

  return (
    <>
      <div className="league-table">
        <h3 style={{ textAlign: "center" }}>VAL Liga</h3>
        <div className="table-container">
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#f0f0f0", color: "#333" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#D7D7D7" }}>
                  <TableCell sx={{ color: "white" }}>Poredak</TableCell>
                  <TableCell sx={{ color: "white" }} align="center">
                    Momčad
                  </TableCell>
                  {turniri.map((turnir, index) => (
                    <TableCell
                      key={index}
                      sx={{ color: "white" }}
                      align="center"
                    >
                      {turnir}
                    </TableCell>
                  ))}
                  <TableCell sx={{ color: "white" }} align="center">
                    Bodovi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankedTeams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>
                      {team.position === 1
                        ? "🥇"
                        : team.position === 2
                        ? "🥈"
                        : team.position === 3
                        ? "🥉"
                        : `${team.position}.`}
                    </TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    {team.pointsPerTournament.map((points, i) => (
                      <TableCell key={i}>
                        {points === 0 ? "-" : points}
                      </TableCell>
                    ))}
                    <TableCell>
                      <strong>{team.totalPoints}</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default LeagueTable;
