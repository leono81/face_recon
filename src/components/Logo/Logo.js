import React from "react";
import Tilt from 'react-tilt';
import brain from "./brainIcon.png";
import "./Logo.css";



const Logo = () => {
   return (
      <div className="ma4 mt0">
         <Tilt className="Tilt br2 shadow-2" options={{ max : 25, perspective: 250 }} style={{ height: 150, width: 150}} >
            <div className="Tilt-inner pa3">
               <img style ={{paddingTop:"5px"}}src ={brain} alt="Brain Icon" /> 
            </div>
         </Tilt>
      </div>
   );
}

export default Logo;