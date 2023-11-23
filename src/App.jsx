import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { Audio } from "react-loader-spinner";

function App() {
  const [notes, setNotes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addNote() {
    fetchData();
  }

  async function deleteNote(id) {
    if (id === undefined) {
      return;
    }
    try {
      await fetch(
        `https://keeperappapi-production.up.railway.app/delete/${id}`,
        {
          method: "POST",
        }
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once on component mount

  // Function to fetch data from MongoDB via your backend API
  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        "https://keeperappapi-production.up.railway.app/notes"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setNotes(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
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
      <div className="notes">
        {notes.map((noteItem, index) => {
          return (
            <Note
              key={index}
              id={noteItem._id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
            />
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);