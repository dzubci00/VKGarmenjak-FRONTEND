import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Typography,
} from "@mui/material";
import "./AddMatch.css";
import Button from "../../shared/components/FormElements/Button";

const AddMatchForm = ({ tournaments, players, onSubmit }) => {
  const { handleSubmit, control, reset, watch, formState } = useForm({
    mode: "onChange", // Enables live validation
  });
  const { isValid } = formState;
  const [playerStats, setPlayerStats] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  const selectedTournamentId = watch("tournament");
  const homeTeam = watch("homeTeam");
  const awayTeam = watch("awayTeam");

  const homeTeamObj = availableTeams.find((team) => team.id === homeTeam);
  const awayTeamObj = availableTeams.find((team) => team.id === awayTeam);

  // Kada se promeni turnir, ažuriramo dostupne ekipe
  useEffect(() => {
    if (selectedTournamentId) {
      const selectedTournament = tournaments.find(
        (t) => t.id === selectedTournamentId
      );
      if (selectedTournament) {
        setAvailableTeams(
          selectedTournament.standings.map((standing) => standing.teamId)
        );
      }
    } else {
      setAvailableTeams([]);
    }
  }, [selectedTournamentId, tournaments]);

  const addPlayerStat = () => {
    setPlayerStats([...playerStats, { playerId: "", goals: 0, assists: 0 }]);
  };

  const updatePlayerStat = (index, key, value) => {
    const newStats = [...playerStats];
    newStats[index][key] = value;
    setPlayerStats(newStats);
  };

  const removePlayerStat = (index) => {
    setPlayerStats(playerStats.filter((_, i) => i !== index));
  };

  const onSubmitForm = (data) => {
    const homeTeamFull = availableTeams.find(
      (team) => team.id === data.homeTeam
    );
    const awayTeamFull = availableTeams.find(
      (team) => team.id === data.awayTeam
    );

    const newMatch = {
      ...data,
      homeTeam: homeTeamFull ? homeTeamFull.teamName : data.homeTeam,
      awayTeam: awayTeamFull ? awayTeamFull.teamName : data.awayTeam,
      playerStats,
    };

    onSubmit(newMatch);
    reset();
    setPlayerStats([]);
  };

  return (
    <Paper sx={{ padding: 2, maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h6" gutterBottom>
        Dodaj utakmicu i statistiku igrača
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        {/* Turnir */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Turnir</InputLabel>
          <Controller
            name="tournament"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field}>
                {tournaments.map((tournament) => (
                  <MenuItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {/* Domaćin */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Domaćin</InputLabel>
          <Controller
            name="homeTeam"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field}>
                {availableTeams
                  .filter((team) => team.id !== awayTeam)
                  .map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.teamName}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </FormControl>

        {/* Gost */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Gost</InputLabel>
          <Controller
            name="awayTeam"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field}>
                {availableTeams
                  .filter((team) => team.id !== homeTeam)
                  .map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.teamName}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </FormControl>

        {/* Rezultat */}
        <Controller
          name="score"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Rezultat" fullWidth margin="normal" />
          )}
        />

        {/* Faza */}
        <Controller
          name="phase"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Faza turnira"
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* Statistika igrača */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>
          Statistika igrača
        </Typography>
        {playerStats.map((stat, index) => (
          <div className="statistika-igraca" key={index}>
            <FormControl style={{ minWidth: 120 }}>
              <InputLabel id={`player-label-${index}`}>Igrač</InputLabel>
              <Select
                labelId={`player-label-${index}`}
                id={`player-select-${index}`}
                value={stat.playerId}
                onChange={(e) =>
                  updatePlayerStat(index, "playerId", e.target.value)
                }
              >
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} {player.surname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="🏐"
              type="number"
              value={stat.goals}
              onChange={(e) =>
                updatePlayerStat(index, "goals", Number(e.target.value))
              }
              style={{ width: 80 }}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="🎯"
              type="number"
              value={stat.assists}
              onChange={(e) =>
                updatePlayerStat(index, "assists", Number(e.target.value))
              }
              style={{ width: 80 }}
              inputProps={{ min: 0 }}
            />

            <Button
              size="small"
              danger
              type="button"
              variant="outlined"
              color="error"
              onClick={() => removePlayerStat(index)}
            >
              Ukloni
            </Button>
          </div>
        ))}

        {/* Dugmići */}
        <div className="dugmici" style={{ marginLeft: 0 }}>
          {(homeTeamObj?.teamName === "VK Garmenjak" ||
            awayTeamObj?.teamName === "VK Garmenjak") && (
            <Button player type="button" onClick={addPlayerStat}>
              Dodaj igrača
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 40 }}
            disabled={
              !isValid ||
              !homeTeam ||
              !awayTeam ||
              !watch("phase") ||
              !watch("score")
            }
          >
            Spremi utakmicu
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default AddMatchForm;
