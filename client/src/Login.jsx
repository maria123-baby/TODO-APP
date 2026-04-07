import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import axios from "axios";
function Login() {
   const [error, setError] = useState("");
   const { register, handleSubmit, reset } = useForm();
   const navigate = useNavigate();
   const onSub = async (data) => {
      setError("");
      try {
         const response = await axios.post(
            "http://localhost:3000/auth/login",
            { email: data.email || "", password: data.password || "" }
         );
         sessionStorage.setItem("token", response.data.token);
         sessionStorage.setItem("username", response.data.user.username);
         navigate("/todo");
         reset();
      }
      catch (err) {
         if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
         } else {
            setError("Something went wrong. Please try again.");
         }
      }
   }
   return (<div className="form-container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSub)}>
         <h2>Login</h2>
         <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control credentials" {...register("email", { required: "Email is required" })} />
         </div>
         <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control credentials" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password should be atleast 6 characters" } })} />
         </div>

         <button type="submit" className="loginbtn">Login</button>
         <div>Don't have an account? <Link to='/signup' className="link">Sign up</Link></div>
         {error && <div className="error-message">{error}</div>}
      </form>
   </div>)
}
export default Login;