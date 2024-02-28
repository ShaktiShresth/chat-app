import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async ({
    fullName,
    username,
    password,
    cPassword,
    gender,
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          cPassword,
          gender,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        return toast.error(data.message);
      }
      //   localStorage.setItem("chat-user", JSON.stringify(data));
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
};

export default useSignup;
