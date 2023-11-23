import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { Audio } from "react-loader-spinner";

function CreateArea(props) {
  const [isExtended, setExtended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://keeperappapi-production.up.railway.app/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(note),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      props.onAdd();
      setNote({
        title: "",
        content: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form className="create-note">
        {isSubmitting && (
          <Audio
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="three-dots-loading"
            wrapperStyle
            wrapperClass
          />
        )}
        {isExtended ? (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        ) : null}
        <textarea
          name="content"
          onChange={handleChange}
          onClick={() => setExtended("true")}
          value={note.content}
          placeholder="Take a note..."
          rows={isExtended ? "3" : "1"}
        />
        <Zoom in={true}>
          <Fab onClick={submitNote} disabled={isSubmitting}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;