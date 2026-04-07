import { Link } from "react-router-dom"
import image1 from './assets/todoimage1.jpg'
export default function Home(){
    return(
        <>
        <div className="home-left">
        <div className="main-container">
            <h1>Organize Your Life</h1>
            <div>Take control of your daily tasks and stay organized with ease. 
                Plan, prioritize and track your progress to achieve your goals faster.
                Simplify your life and focus on what truly matters everyday.</div>

            <Link to='/signUp'><button className="home-button">Get Started</button></Link>
        </div>
        </div>
        <div className="home-right">
                    <img className="image1" src={image1} alt="" />
                </div>
    </>
    )
}