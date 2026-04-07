import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
function SignUp() {
   const [error, setError] = useState("");
   const { register, handleSubmit, reset, formState: { errors } } = useForm();
   const navigate = useNavigate();
   const onSub = async (data) => {
      setError("");
      try {
         const response = await axios.post(
            "http://localhost:3000/auth/signup",
            { username: data.username, email: data.email, password: data.password }
         );

         navigate("/login");
         reset();

      }
      catch (err) {
         if (err.response && err.response.data) {
            setError(err.response.data.message);
         } else {
            setError("Something went wrong. Please try again.");
         }
         console.log(err);
      }
   }
   return (<div className="form-container d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSub)}>
         <h2>Sign Up</h2>
         <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control credentials" {...register("username", { required: "Username is required" })} />
         </div>
         <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control credentials" {...register("email", { required: "Email is required" })} />
         </div>
         <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control credentials" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password should be atleast 6 characters" } })} />
         </div>
         {error && <div className="error-message">{error}</div>}
         <button type="submit" className="signupbtn">Sign Up</button>
         <div>Already have an account?<Link to='/login' className="link">Login</Link></div>
      </form>
   </div>)
}
export default SignUp;