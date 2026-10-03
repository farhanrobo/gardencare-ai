"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { PLANT_LOCATION_PRESETS } from "@/lib/constants";
import type { NewPlantInput } from "@/lib/data/DataContext";
import type { Plant } from "@/lib/types";

const CUSTOM = "__custom__";

interface PlantFormDialogProps {
  open: boolean;
  onClose: () => void;
  plant?: Plant | null;
  onSubmit: (input: NewPlantInput) => void;
}

export function PlantFormDialog({ open, onClose, plant, onSubmit }: PlantFormDialogProps) {
  const isEdit = Boolean(plant);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit plant" : "Add a plant"}
      description={
        isEdit
          ? "Update this plant record. Scan history is kept."
          : "Create a record so you can attach scans and track health over time."
      }
    >
      <PlantFormBody plant={plant ?? null} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  );
}

interface PlantFormBodyProps {
  plant: Plant | null;
  onSubmit: (input: NewPlantInput) => void;
  onCancel: () => void;
}

function PlantFormBody({ plant, onSubmit, onCancel }: PlantFormBodyProps) {
  // Initialized on mount only — the Modal unmounts its children while closed,
  // so every open starts from the current plant values.
  const presetMatch = PLANT_LOCATION_PRESETS.find((preset) => preset === plant?.location);
  const [name, setName] = useState(plant?.name ?? "");
  const [species, setSpecies] = useState(plant?.species ?? "");
  const [locationChoice, setLocationChoice] = useState<string>(
    plant && !presetMatch ? CUSTOM : (presetMatch ?? PLANT_LOCATION_PRESETS[0]),
  );
  const [customLocation, setCustomLocation] = useState(plant && !presetMatch ? plant.location : "");
  const [notes, setNotes] = useState(plant?.notes ?? "");
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Please give the plant a name.";
    const location = locationChoice === CUSTOM ? customLocation.trim() : locationChoice;
    if (!location) nextErrors.location = "Please choose or enter a location.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ name, species, location, notes });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Plant name"
        placeholder="e.g. Tomato 'Moneymaker'"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        required
      />
      <TextField
        label="Plant type / species"
        optional
        placeholder="e.g. Tomato (Solanum lycopersicum)"
        value={species}
        onChange={(event) => setSpecies(event.target.value)}
      />
      <SelectField
        label="Location"
        value={locationChoice}
        onChange={(event) => setLocationChoice(event.target.value)}
        error={errors.location}
      >
        {PLANT_LOCATION_PRESETS.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
        <option value={CUSTOM}>Custom location…</option>
      </SelectField>
      {locationChoice === CUSTOM ? (
        <TextField
          label="Custom location"
          placeholder="e.g. South-facing windowsill"
          value={customLocation}
          onChange={(event) => setCustomLocation(event.target.value)}
          error={customLocation.trim() ? undefined : errors.location}
        />
      ) : null}
      <TextAreaField
        label="Notes"
        optional
        placeholder="Variety, planting date, anything worth remembering…"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{plant ? "Save changes" : "Add plant"}</Button>
      </div>
    </form>
  );
}
