import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const { data } = useQuery({
    queryKey: ["notes", debouncedQuery, page],
    queryFn: () => fetchNotes(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleInputChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {data?.notes?.length && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}

      <Toaster />
    </div>
  );
}
