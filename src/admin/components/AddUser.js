import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload"; // Importaj komponentu

const AddUser = ({ onSubmit }) => {
  const { handleSubmit, control, reset, watch, formState } = useForm({
    mode: "onChange",
  });
  const { isValid } = formState;

  const [selectedImage, setSelectedImage] = useState(null);

  const onImageInput = (id, file, isValid) => {
    setSelectedImage(file);
  };

  const onSubmitForm = (data) => {
    const newUser = {
      name: data.name,
      surname: data.surname,
      birthDate: data.birthDate,
      role: data.role,
      position: data.position,
      image: selectedImage,
    };

    onSubmit(newUser);

    reset();
    setSelectedImage(null);
  };

  return (
    <Paper sx={{ padding: 2, maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h6" gutterBottom>
        Dodaj korisnika
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Ime" fullWidth margin="normal" />
          )}
        />

        <Controller
          name="surname"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Prezime" fullWidth margin="normal" />
          )}
        />

        <Controller
          name="birthDate"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Datum rođenja"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Uloga</InputLabel>
              <Select {...field} label="Uloga">
                <MenuItem value="igrač">Igrač</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="trener">Trener</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="position"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>Pozicija</InputLabel>
              <Select {...field} label="Pozicija">
                <MenuItem value="Napadač">Napadač</MenuItem>
                <MenuItem value="Bek">Bek</MenuItem>
                <MenuItem value="Centar">Centar</MenuItem>
                <MenuItem value="Golman">Golman</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <ImageUpload id="image" onInput={onImageInput} />

        <Button
          forma
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 40 }}
          disabled={
            !isValid ||
            !watch("name") ||
            !watch("surname") ||
            !watch("birthDate") ||
            !watch("role") ||
            !watch("position") ||
            !selectedImage
          }
        >
          Spremi korisnika
        </Button>
      </form>
    </Paper>
  );
};

export default AddUser;
