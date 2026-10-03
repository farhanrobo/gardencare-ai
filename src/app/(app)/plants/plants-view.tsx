"use client";

import { useMemo, useState } from "react";
import { Plus, SearchX, Sprout } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { PlantCard } from "@/components/plants/PlantCard";
import { PlantFormDialog } from "@/components/plants/PlantFormDialog";
import { plantStatus, useAppData } from "@/lib/data/DataContext";
import type { NewPlantInput } from "@/lib/data/DataContext";
import type { Plant } from "@/lib/types";

export function PlantsView() {
  const { ready, plants, scans, settings, addPlant, updatePlant, deletePlant } = useAppData();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Plant | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return plants;
    return plants.filter((plant) =>
      [plant.name, plant.species, plant.location].some((field) => field.toLowerCase().includes(query)),
    );
  }, [plants, search]);

  const handleSubmit = (input: NewPlantInput) => {
    if (editing) {
      updatePlant(editing.id, input);
    } else {
      addPlant(input);
    }
    setFormOpen(false);
    setEditing(null);
  };

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Plants"
        description="Keep a record for each plant so every scan builds a health history over time."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add plant
          </Button>
        }
      />

      {plants.length > 0 ? (
        <div className="mb-5 max-w-sm">
          <label htmlFor="plant-search" className="sr-only">
            Search plants
          </label>
          <input
            id="plant-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, species or location…"
            className="w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/25"
          />
        </div>
      ) : null}

      {plants.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface shadow-soft">
          <EmptyState
            icon={Sprout}
            title="No plants yet"
            description="Create your first plant record — scans you attach to it will show up on its card."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add your first plant
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface shadow-soft">
          <EmptyState
            icon={SearchX}
            title="No plants match your search"
            description="Try a different name, species or location."
            action={
              <Button variant="secondary" onClick={() => setSearch("")}>
                Clear search
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plant) => (
            <li key={plant.id}>
              <PlantCard
                plant={plant}
                status={plantStatus(scans, plant.id, settings.confidenceThreshold)}
                threshold={settings.confidenceThreshold}
                onEdit={() => {
                  setEditing(plant);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleteTarget(plant)}
              />
            </li>
          ))}
        </ul>
      )}

      <PlantFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        plant={editing}
        onSubmit={handleSubmit}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete plant?"
        description={
          deleteTarget
            ? `This removes "${deleteTarget.name}" from your records. Its scan history is kept, but the scans are unlinked.`
            : undefined
        }
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) deletePlant(deleteTarget.id);
              setDeleteTarget(null);
            }}
          >
            Delete plant
          </Button>
        </div>
      </Modal>
    </div>
  );
}
