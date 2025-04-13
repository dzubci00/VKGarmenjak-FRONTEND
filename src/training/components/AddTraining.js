import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Paper, Typography } from "@mui/material";
import Button from "../../shared/components/FormElements/Button";
import "./AddTraining.css";

const AddTraining = ({ onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];
  const { handleSubmit, control, reset, watch, formState } = useForm({
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmitForm = (data) => {
    const newTraining = {
      trainingType: data.trainingType,
      date: data.date,
      location: data.location,
      time: data.time,
    };

    onSubmit(newTraining);
    reset();
  };

  return (
    <Paper className="training-paper" sx={{ padding: 2, margin: "0 auto" }}>
      <Typography variant="h6" gutterBottom>
        Dodaj trening
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          name="date"
          control={control}
          defaultValue={today}
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

        <Controller
          name="time"
          control={control}
          defaultValue="18:00"
          render={({ field }) => (
            <TextField
              {...field}
              label="Vrijeme"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        {/* Lokacija treninga */}
        <Controller
          name="location"
          control={control}
          defaultValue="Gradski bazeni Zadar"
          render={({ field }) => (
            <TextField {...field} label="Lokacija" fullWidth margin="normal" />
          )}
        />
        {/* Tip treninga */}
        <Controller
          name="trainingType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Tip treninga"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Button
          forma
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 40 }}
          disabled={
            !isValid ||
            !watch("trainingType") ||
            !watch("time") ||
            !watch("location") ||
            !watch("date")
          }
        >
          Spremi trening
        </Button>
      </form>
    </Paper>
  );
};

export default AddTraining;
