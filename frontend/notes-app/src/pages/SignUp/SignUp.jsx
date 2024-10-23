// import React, { useState } from "react";
// import Navbar from "../../components/Navbar/Navbar";
// import PasswordInput from "../../components/Input/PasswordInput";
// import { Link, useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     if (!name) {
//       setError("Please enter your name.");
//       return;
//     }
//     if (!email) {
//       setError("Please enter a valid email id");
//       return;
//     }
//     if (!password) {
//       setError("Input a password");
//       return;
//     }

//     setError("");
//     //SignUp API Call
//     try {
//       const response = await axiosInstance.post("/create-account", {
//         fullName: name,
//         email: email,
//         password: password,
//       });
//       //Handle successful registration response
//       if (response.data && response.data.error) {
//         setError(response.data.message);
//         return;
//       }
//       if (response.data && response.data.accessToken) {
//         localStorage.setItem("token", response.data.accessToken);
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       //Handle login error
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         setError(error.response.data.message);
//       } else {
//         setError("An unexpeted error occured. Please try again");
//       }
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="flex items-center justify-center mt-28">
//         <div className="w-96 border rounded bg-white px-7 py-10">
//           <form onSubmit={handleSignUp}>
//             <h4 className="text-2xl mb-7">Signup</h4>

//             <input
//               type="text"
//               placeholder="Name"
//               className="input-box"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Email"
//               className="input-box"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <PasswordInput
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

//             <button type="submit" className="btn-primary">
//               SignUp
//             </button>
//             <p className="text-sm text-center mt-4">
//               Already have an account?{" "}
//               <Link to="/login" className=" font-medium text-primary underline">
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // Ensure axiosInstance is imported

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email) {
      setError("Please enter a valid email id");
      return;
    }
    if (!password) {
      setError("Input a password");
      return;
    }

    setError("");
    setIsLoading(true); // Set loading state to true

    // SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        setIsLoading(false); // Reset loading state
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle signup error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false); // Reset loading state in any case
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Signup</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Name"
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
