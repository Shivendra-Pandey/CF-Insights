import { useState } from "react";
import { Link } from "react-router-dom";
function Landing() {
    const [name, setName] = useState("");
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen font-montserrat">
        <h1 className="text-8xl  my-2 font-bold "><span className="text-yellow-400">C</span ><span className="text-blue-400">F</span> - <span className="text-red-500">Insights</span> </h1>
        <p className="text-center text-2xl mx-2 break-words my-4 px-4 w-[75%]">Analyze, Improve, Excel !</p>
        <div className="flex my-6">
        <p className="text-xl mx-2">CF handle : </p>
        <input className=" outline-none focus:outline-none active:outline-none" id="username" name="username" placeholder="Enter your CF handle"
        value={name} 
        onChange={(e)=>{
            setName(e.target.value);
        }}></input>
        </div>
        <Link to="/analyzer" state={{name}}>
            <button className="my-2 bg-blue-500 text-white px-2 py-2 rounded-xl hover:bg-black hover:transition-colors " >Let's Analyze</button>
        </Link>
      </div>
    );
  }
  
  export default Landing;
  