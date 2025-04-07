import React, { useState } from "react";
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
import Button from "../../shared/components/FormElements/Button";
import "./AddTournament.css";

const AddTournament = ({ teams, onSubmit }) => {
  const { handleSubmit, control, reset, watch, formState } = useForm({
    mode: "onChange",
  });
  const { isValid } = formState;
  const [teamsForAdd, setTeamsForAdd] = useState([]);

  const tournament = watch("tournament");

  // Dodaj ekipu u turnir
  const addTournamentTeam = () => {
    setTeamsForAdd([...teamsForAdd, { teamId: "" }]);
  };

  // Ukloni ekipu iz turnira
  const removeTournamentTeam = (index) => {
    setTeamsForAdd(teamsForAdd.filter((_, i) => i !== index));
  };

  const updateTeamSelection = (index, value) => {
    const updatedTeams = [...teamsForAdd];
    updatedTeams[index].teamId = value;
    setTeamsForAdd(updatedTeams);
  };

  const onSubmitForm = (data) => {
    const newTournament = {
      name: data.tournament,
      date: data.date,
      teams: teamsForAdd.map((team) => team.teamId),
    };

    onSubmit(newTournament);
    reset();
    setTeamsForAdd([]);
  };

  return (
    <Paper sx={{ padding: 2, maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h6" gutterBottom>
        Dodaj turnir
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        {/* Naziv turnira */}
        <Controller
          name="tournament"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Naziv turnira"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Datum"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        {/* Dodavanje ekipa */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>
          Ekipe
        </Typography>

        {teamsForAdd.map((team, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <FormControl style={{ minWidth: 120, flexGrow: 1 }}>
              <InputLabel>Ekipa</InputLabel>
              <Select
                value={team.teamId || ""}
                onChange={(e) => updateTeamSelection(index, e.target.value)}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.teamName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              size="small"
              danger
              type="button"
              variant="outlined"
              color="error"
              onClick={() => removeTournamentTeam(index)}
            >
              Ukloni
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outlined"
          color="primary"
          player
          onClick={addTournamentTeam}
        >
          Dodaj ekipu
        </Button>

        <Button
          forma
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 40 }}
          disabled={
            !isValid ||
            !tournament ||
            teamsForAdd.length === 0 ||
            !watch("date")
          }
        >
          Spremi turnir
        </Button>
      </form>
    </Paper>
  );
};

export default AddTournament;
