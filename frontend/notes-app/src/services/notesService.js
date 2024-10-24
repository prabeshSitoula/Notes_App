import axiosInstance from "../utils/axiosInstance";

// Get all notes
export const getAllNotes = () => axiosInstance.get("/get-all-notes");

// Delete a note
export const deleteNote = (noteId) =>
  axiosInstance.delete(`/delete-note/${noteId}`);

// Update pinned status
export const updateNotePinned = (noteId, isPinned) =>
  axiosInstance.put(`/update-note-pinned/${noteId}`, { isPinned });

// Search notes
export const searchNotes = (query) =>
  axiosInstance.get(`/search-notes?query=${query}`);
