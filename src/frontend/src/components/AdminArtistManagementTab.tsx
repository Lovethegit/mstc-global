import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, ExternalLink, Mic2, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import type { MusicArtist } from "../backend";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";

const ADMIN_TOKEN = "Lovemstc@2019";

function useMusicArtists() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MusicArtist[]>({
    queryKey: ["musicArtists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMusicArtists();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

function useUpdateMusicArtist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      available: boolean;
      bio: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMusicArtist(
        ADMIN_TOKEN,
        vars.id,
        vars.available,
        vars.bio,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["musicArtists"] }),
  });
}

function useAddMusicArtist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      genre: string;
      bio: string;
      specialties: string[];
      youtubeUrl: string;
      instagramUrl: string;
      bookingContact: string;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addMusicArtist(
        ADMIN_TOKEN,
        vars.name,
        vars.genre,
        vars.bio,
        vars.specialties,
        vars.youtubeUrl,
        vars.instagramUrl,
        vars.bookingContact,
        vars.available,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["musicArtists"] }),
  });
}

type AddForm = {
  name: string;
  genre: string;
  bio: string;
  specialties: string;
  youtubeUrl: string;
  instagramUrl: string;
  bookingContact: string;
  available: boolean;
};

const EMPTY_FORM: AddForm = {
  name: "",
  genre: "",
  bio: "",
  specialties: "",
  youtubeUrl: "",
  instagramUrl: "",
  bookingContact: "",
  available: true,
};

function ArtistEditPanel({
  artist,
  onCancel,
}: { artist: MusicArtist; onCancel: () => void }) {
  const [bio, setBio] = useState(artist.bio);
  const [available, setAvailable] = useState(artist.available);
  const update = useUpdateMusicArtist();

  async function handleSave() {
    await update.mutateAsync({ id: artist.id, available, bio });
    onCancel();
  }

  return (
    <tr data-ocid={`artists.edit_row.${artist.id}`}>
      <td colSpan={7} className="p-4 bg-muted/10">
        <div className="space-y-3">
          <p className="font-semibold text-foreground">{artist.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500 resize-none"
                placeholder="Artist biography…"
                data-ocid={`artists.bio_textarea.${artist.id}`}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  Availability
                </label>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setAvailable(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      available
                        ? "bg-green-600/20 text-green-400 border-green-600/40"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    data-ocid={`artists.available_button.${artist.id}`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvailable(false)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      !available
                        ? "bg-destructive/20 text-destructive border-destructive/40"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    data-ocid={`artists.unavailable_button.${artist.id}`}
                  >
                    Unavailable
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={update.isPending}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg gold-gradient text-obsidian-900 text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
              data-ocid={`artists.save_button.${artist.id}`}
            >
              <Save size={13} /> {update.isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
              data-ocid={`artists.cancel_button.${artist.id}`}
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function AddArtistModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const add = useAddMusicArtist();
  const set =
    (k: keyof AddForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await add.mutateAsync({
      ...form,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-obsidian-900/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      data-ocid="artists.add.dialog"
    >
      <div className="w-full max-w-lg bg-card border border-gold-700/40 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/30">
          <h2 className="font-serif text-lg font-bold gold-text">
            Add New Artist
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-obsidian-700 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="artists.add.close_button"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name", "genre", "bookingContact"] as const).map((k) => (
              <div key={k} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  {k.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={form[k] as string}
                  onChange={set(k)}
                  className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                  placeholder={k === "name" ? "Artist name *" : ""}
                  required={k === "name"}
                  data-ocid={`artists.add.${k}_input`}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Specialties (comma-separated)
              </label>
              <input
                type="text"
                value={form.specialties}
                onChange={set("specialties")}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                placeholder="Classical, Bhajan, Folk"
                data-ocid="artists.add.specialties_input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                YouTube URL
              </label>
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={set("youtubeUrl")}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                placeholder="https://youtube.com/…"
                data-ocid="artists.add.youtube_input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={set("instagramUrl")}
                className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                placeholder="https://instagram.com/…"
                data-ocid="artists.add.instagram_input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={set("bio")}
              className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500 resize-none"
              placeholder="Artist biography…"
              data-ocid="artists.add.bio_textarea"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Available for Bookings
            </label>
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({ ...p, available: !p.available }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.available ? "bg-green-600" : "bg-muted/40"
              }`}
              data-ocid="artists.add.available_switch"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.available ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 rounded-lg text-sm hover:bg-obsidian-700 transition-colors"
              data-ocid="artists.add.cancel_button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={add.isPending || !form.name.trim()}
              className="flex-1 py-2.5 gold-gradient text-obsidian-900 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              data-ocid="artists.add.submit_button"
            >
              {add.isPending ? "Adding…" : "Add Artist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ArtistManagementTab() {
  const { data: artists = [], isLoading } = useMusicArtists();
  const updateArtist = useUpdateMusicArtist();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const available = artists.filter((a) => a.available).length;
  const unavailable = artists.length - available;

  return (
    <div className="space-y-6" data-ocid="artists.section">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="admin-stats-card">
          <span className="admin-stats-label">Total Artists</span>
          <span className="admin-stats-value">{artists.length}</span>
        </div>
        <div className="admin-stats-card border-green-600/30">
          <span className="admin-stats-label">Available</span>
          <span className="admin-stats-value text-green-400">{available}</span>
        </div>
        <div className="admin-stats-card border-destructive/30">
          <span className="admin-stats-label">Unavailable</span>
          <span className="admin-stats-value text-destructive">
            {unavailable}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Manage your music artist roster. Toggle availability and update bios.
        </p>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity"
          data-ocid="artists.add_button"
        >
          <Plus size={15} /> Add Artist
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="artists.loading_state"
          >
            Loading artists…
          </div>
        ) : artists.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="artists.empty_state"
          >
            <Mic2 size={32} className="mx-auto mb-3 text-muted-foreground/40" />
            <p>No artists yet.</p>
            <p className="text-xs mt-1">
              Click "Add Artist" to add your first music artist to the roster.
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Genre</th>
                <th>Specialties</th>
                <th>Booking Contact</th>
                <th>Links</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a, i) =>
                editingId === a.id ? (
                  <ArtistEditPanel
                    key={a.id}
                    artist={a}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <tr key={a.id} data-ocid={`artists.table.item.${i + 1}`}>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm text-foreground">
                          {a.name}
                        </span>
                        {a.bio && (
                          <span className="text-xs text-muted-foreground line-clamp-1 max-w-36">
                            {a.bio}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded bg-gold-700/15 text-gold-300 border border-gold-700/30">
                        {a.genre || "—"}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground max-w-36">
                      {a.specialties.length > 0
                        ? a.specialties.join(", ")
                        : "—"}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {a.bookingContact || "—"}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {a.youtubeUrl && (
                          <a
                            href={a.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-0.5 rounded bg-red-700/15 text-red-300 border border-red-700/30 hover:bg-red-700/25 transition-colors inline-flex items-center gap-1"
                            data-ocid={`artists.youtube_link.${i + 1}`}
                          >
                            <ExternalLink size={10} /> YT
                          </a>
                        )}
                        {a.instagramUrl && (
                          <a
                            href={a.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-0.5 rounded bg-pink-700/15 text-pink-300 border border-pink-700/30 hover:bg-pink-700/25 transition-colors inline-flex items-center gap-1"
                            data-ocid={`artists.instagram_link.${i + 1}`}
                          >
                            <ExternalLink size={10} /> IG
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          updateArtist.mutate({
                            id: a.id,
                            available: !a.available,
                            bio: a.bio,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          a.available
                            ? "bg-green-600/20 text-green-400 border-green-600/40 hover:bg-green-600/30"
                            : "bg-destructive/20 text-destructive border-destructive/40 hover:bg-destructive/30"
                        }`}
                        data-ocid={`artists.toggle_button.${i + 1}`}
                      >
                        {a.available ? "✓ Available" : "✗ Unavailable"}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                        aria-label="Edit artist"
                        onClick={() => setEditingId(a.id)}
                        data-ocid={`artists.edit_button.${i + 1}`}
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddArtistModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
