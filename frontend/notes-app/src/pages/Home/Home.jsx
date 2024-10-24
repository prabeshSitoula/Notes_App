// import React, { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar/Navbar";
// import NoteCard from "../../components/Cards/NoteCard";
// import { MdAdd } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// import AddEditNotes from "./AddEditNotes";
// import Modal from "react-modal";
// import axiosInstance from "../../utils/axiosInstance";
// import moment from "moment";

// const Home = () => {
//   const [openAddEditModal, setOpenAddEditModal] = useState({
//     isShown: false,
//     type: "add",
//     data: null,
//   });

//   const [allNotes, setAllNotes] = useState([]);
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();

//   //Get User Info
//   const getUserInfo = async () => {
//     try {
//       const response = await axiosInstance.get("/get-user");
//       if (response.data && response.data.user) {
//         setUserInfo(response.data.user);
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       if (error.response && error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   //Get all notes
//   const getAllNotes = async () => {
//     try {
//       const response = await axiosInstance.get("/get-all-notes");
//       if (response.data && response.data.notes) {
//         setAllNotes(response.data.notes);
//       }
//     } catch (error) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   useEffect(() => {
//     getAllNotes();
//     getUserInfo();
//     return () => {};
//   }, []);

//   return (
//     <>
//       <Navbar userInfo={userInfo} />

//       <div className="container mx-auto">
//         <div className="grid grid-cols-3 gap-4 mt-8">
//           {allNotes.map((item, index) => (
//             <NoteCard
//               key={item._id}
//               title={item.title}
//               date={moment(item.createdOn).format("Do MMM YYYY")}
//               content={item.content}
//               tags={item.tags.join(", ")}
//               isPinned={item.isPinned}
//               onEdit={() => {}}
//               onDelete={() => {}}
//               onPinNote={() => {}}
//             />
//           ))}
//         </div>
//       </div>

//       <button
//         className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
//         onClick={() => {
//           setOpenAddEditModal({ isShown: true, type: "add", data: null });
//         }}
//       >
//         <MdAdd className="text-[32px] text-white" />
//       </button>

//       <Modal
//         isOpen={openAddEditModal.isShown}
//         onRequestClose={() => {
//           // setOpenAddEditModal({ isShown: false, type: "add", data: null });
//         }}
//         style={{
//           overlay: {
//             backgroundColor: "rgba(0, 0, 0, 0.2)",
//             // zIndex: 1000,
//           },
//         }}
//         contentLabel=""
//         className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
//       >
//         <AddEditNotes
//           type={openAddEditModal.type}
//           noteData={openAddEditModal.data}
//           onClose={() => {
//             setOpenAddEditModal({ isShown: false, type: "add", data: null });
//           }}
//           getAllNotes={getAllNotes}
//         />
//       </Modal>
//     </>
//   );
// };
// export default Home;

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard";
import Svg from "../../assets/react.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const updateIsPinned = async (noteData) => {
    try {
      const response = await axiosInstance.put(
        `/update-note-pinned/${noteData._id}`,
        { isPinned: !noteData.isPinned }
      );
      if (response.data) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      data: noteDetails,
      type: "edit",
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };
  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log("Authentication failed. Redirecting to login.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log("Authentication failed. Redirecting to login.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Delete Note
  const deleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      } else {
        showToastMessage(
          response.data.message || "Failed to delete note",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      showToastMessage(
        error.response?.data?.message ||
          "Failed to delete note. Please try again.",
        "error"
      );
    }
  };

  //Search for a Note
  const searchNote = async (searchQuery) => {
    try {
      const response = await axiosInstance.get(
        `/search-notes?query=${searchQuery}`
      );
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching for note:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log("Authentication failed. Redirecting to login.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  const sortedNotes = [...allNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdOn) - new Date(a.createdOn);
  });

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchNote={searchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {sortedNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn} // Ensure this is the correct field name
                content={item.content}
                tags={item.tags} // Pass the tags array directly
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item._id)} // Add your delete functionality here
                onPinNote={() => updateIsPinned(item)} // Add your pin functionality here
              />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={Svg} message={`Start creating your first note`} />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
