import css from "./NoteForm.module.css";
import { Formik, Form, ErrorMessage, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { CreateNoteParams } from "../../services/noteService";
import toast from "react-hot-toast";

interface NoteFormProps {
  query: string;
  page: number;
  onSubmit: () => void;
  onCancel: () => void;
}

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

type InitialValues = CreateNoteParams;

const initialValues: InitialValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const formScheme = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less or equal to 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.string().oneOf(tags),
});

export default function NoteForm({
  query,
  page,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const queryClient = useQueryClient();
  const noteCreate = useMutation({
    mutationFn: async ({ title, content, tag }: InitialValues) => {
      const data = await createNote({ title, content, tag });
      return data;
    },
    onSuccess: () => {
      onSubmit();
      toast.success("Note created");
      queryClient.invalidateQueries({ queryKey: ["notes", query, page] });
    },
    onError: () => {
      toast.error("Error");
    },
  });
  const onFormSubmit = (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    noteCreate.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmit}
      validationSchema={formScheme}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            name="content"
            id="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
