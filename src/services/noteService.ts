import axios from "axios";
import type { Note } from "../types/note";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export const fetchNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 12
): Promise<NoteResponse> => {
  const res = await axios.get<NoteResponse>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: { search, page, perPage },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return res.data;
};

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
  const res = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    newNote,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return res.data;
};
