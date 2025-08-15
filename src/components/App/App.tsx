import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data: notes, isSuccess } = useQuery({
    queryKey: ["notes", debouncedQuery, page],
    queryFn: () => fetchNotes(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });
  const totalPages = notes?.totalPages ?? 1;
  const onQueryChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setQuery(event.target.value);
    },
    300
  );
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={onQueryChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isSuccess && notes && (
        <NoteList query={debouncedQuery} page={page} notes={notes.notes} />
      )}
      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm
            query={debouncedQuery}
            page={page}
            onSubmit={handleClose}
            onCancel={handleClose}
          />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
