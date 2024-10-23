// import React, { useState } from "react";
// import TagInput from "../../components/Input/TagInput";
// import { MdClose } from "react-icons/md";
// import axiosInstance from "../../utils/axiosInstance";

// const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState([]);

//   const [error, setError] = useState(null);

//   //Add note
//   const addNewNote = async () => {
//     try {
//       const response = await axiosInstance.post("/add-note", {
//         title,
//         content,
//         tags,
//       });
//       if (response.data && response.data.note) {
//         getAllNotes();
//         onClose();
//       }
//     } catch (error) {
//       if (error) {
//         error.response && error.response.data && error.response.data.message;
//       }
//       setError(error.response.data.message);
//     }
//   };
//   //Edit note
//   const editNote = async () => {};

//   const handleAddNote = () => {
//     if (!title) {
//       setError("Title is required");
//       return;
//     }
//     if (!content) {
//       setError("Content is required");
//       return;
//     }

//     setError("");

//     if (type === "edit") {
//       editNote();
//     } else {
//       addNewNote();
//     }
//   };

//   return (
//     <div className="relative">
//       <button
//         className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3  hover:bg-slate-500"
//         onClick={onClose}
//       >
//         <MdClose className="text-xl text-slate-400" />
//       </button>
//       <div className="flex flex-col gap-2">
//         <label className="input-label">Title</label>
//         <input
//           type="text"
//           className="text-2xl text-slate-950 outline-none"
//           placeholder="Go to Gym At 5"
//           value={title}
//           onChange={(e) => {
//             setTitle(e.target.value);
//           }}
//         />
//       </div>

//       <div className="flex flex-col gap-2 mt-4">
//         <label className="input-label">Content</label>
//         <textarea
//           type="text"
//           className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
//           placeholder="Content"
//           rows={10}
//           value={content}
//           onChange={(e) => {
//             setContent(e.target.value);
//           }}
//         />
//       </div>

//       <div className="mt-3">
//         <label className="input-label">Tags</label>
//         <TagInput tags={tags} setTags={setTags} />
//       </div>

//       {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

//       <button
//         className="btn-primary font-medium mt-5 p-3"
//         onClick={handleAddNote}
//       >
//         Add
//       </button>
//     </div>
//   );
// };

// export default AddEditNotes;

import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Effect for editing existing notes
  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [type, noteData]);

  // Add note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit note
  const editNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });
      if (response.data) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3  hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to Gym At 5"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default AddEditNotes;
