import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Chart from "chart.js/auto";
import { Bar,Pie, Doughnut } from "react-chartjs-2";

function Analyzer(){

    const location = useLocation();
    const state = location.state;

    const [data,setData] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [ ratingshow, setRatingShow ] = useState(false);
    const [ tagsshow, setTagsShow ] = useState(false);
    const [selectedTag,setSelectedTag] = useState("None");
    const [selectedRating,setSelectedRating] = useState("None");

    let getData = async ()=>{
         fetch(`https://codeforces.com/api/user.status?handle=${state.name}`)
         .then(response=>response.json())
         .then(response=>{
             setData(response);
            }
         )
         .catch(error=>console.log(error.message))
    }

    let getUserInfo = async ()=>{
        fetch(`https://codeforces.com/api/user.info?handles=${state.name}`)
        .then(response=>response.json())
        .then(response=>{
            setUserInfo(response.result[0]);
           }
        )
        .catch(error=>console.log(error.message))
    }

    console.log(data);
    console.log(userInfo);
    
    let verdictMap = new Map();
    let languagesMap = new Map();
    let tagsMap = new Map();
    let questionRatingMap = new Map();
    let questionIndexMap = new Map();
    
    let resultArray = data.result;


    if(resultArray != undefined){
    resultArray.forEach((e)=>{
        if(verdictMap.has(e.verdict)){
            verdictMap.set(e.verdict,verdictMap.get(e.verdict)+1);
        }
        else{
            verdictMap.set(e.verdict,1);
        }

        if(languagesMap.has(e.programmingLanguage)){
            languagesMap.set(e.programmingLanguage,languagesMap.get(e.programmingLanguage)+1);
        }else{
            languagesMap.set(e.programmingLanguage,1);
        }
        if(e.verdict=="OK")
        {e.problem.tags.forEach((tag)=>{
            if(tagsMap.has(tag)){
                tagsMap.set(tag,tagsMap.get(tag)+1);
            }else{
                tagsMap.set(tag,1);
            }
        })}
        if(e.problem.rating && e.verdict=="OK"){
            if(questionRatingMap.has(e.problem.rating)){
                questionRatingMap.set(e.problem.rating,questionRatingMap.get(e.problem.rating)+1);
            }else{
                questionRatingMap.set(e.problem.rating,1);
            }
        }
        if(e.problem.index && e.problem.index[0]>='A' && e.problem.index[0]<='Z' && e.verdict=="OK"){
            if(questionIndexMap.has(e.problem.index[0])){
                questionIndexMap.set(e.problem.index[0],questionIndexMap.get(e.problem.index[0])+1);
            }else{
                questionIndexMap.set(e.problem.index[0],1);
            }
        }
    })}
    
    tagsMap = new Map([...tagsMap.entries()].sort((a,b)=>b[1]-a[1]));
    verdictMap = new Map([...verdictMap.entries()].sort((a,b)=>b[1]-a[1]));
    questionRatingMap = new Map([...questionRatingMap.entries()].sort((a,b)=>b[0]-a[0]).reverse());
    questionIndexMap = new Map([...questionIndexMap.entries()].sort());


    let colors = [];

    const TagsDropdownItems = ["None",...tagsMap.keys()];
    const RatingDropdownItems = ["None",...questionRatingMap.keys()];


    //filter data according to selected tag & rating
    //display data in charts
    // craete a seperate map for each chart

    let tagLinks = [];
    let ratingLinks = [];

    let unsolvedTagLinks = [];
    let unsolvedRatingLinks = [];

    //generate link for each problems using contestId, index

    if(resultArray != undefined){
      resultArray.forEach((e)=>{
        if(e.problem.tags.includes(selectedTag) || selectedTag=="None"){
            if(e.problem.rating==selectedRating || selectedRating=="None"){
                if(e.verdict=="OK"){
                    tagLinks.push(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`);
                    ratingLinks.push(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`);
                }
            }
        }
      })

        resultArray.forEach((e)=>{
            if(e.problem.tags.includes(selectedTag) || selectedTag=="None"){
                if(e.problem.rating==selectedRating || selectedRating=="None"){
                    if(e.verdict!="OK"){
                        if(!tagLinks.includes(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`))
                        unsolvedTagLinks.push(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`);
                        if(!ratingLinks.includes(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`))
                        unsolvedRatingLinks.push(`https://codeforces.com/problemset/problem/${e.problem.contestId}/${e.problem.index}`);
                    }
                }
            }
        })


    }

    
    

    const barChartData =  {  data: {
            labels: [...questionRatingMap.keys()],
            datasets: [{
                label: 'Number of questions',
                data: [...questionRatingMap.values()],
                backgroundColor: "green",
                borderWidth: 0,
                borderColor: "#777",
            }]
    }}

    const barChartData2 =  {  data: {
        labels: [...questionIndexMap.keys()],
        datasets: [{
            label: 'Number of questions',
            data: [...questionIndexMap.values()],
            backgroundColor: "green",
            borderWidth: 0,
            borderColor: "#777",
        }]
    }}

    const donughtdata =  {  data: {
            labels: [...tagsMap.keys()],
            datasets: [{
                label: 'Number of questions',
                data: [...tagsMap.values()],
                backgroundColor: colors,
                borderWidth: 0,
                borderColor: "#777",
            }]
    }}

    const piechartdata =  {  data: {
        labels: [...verdictMap.keys()],
        datasets: [{
            data: [...verdictMap.values()],
            backgroundColor: colors,
            borderWidth: 0,
            borderColor: "#777",
        }]
    }}


    const piechartdata2 =  {  data: {
        labels: [...languagesMap.keys()],
        datasets: [{
            data: [...languagesMap.values()],
            backgroundColor: colors,
            borderWidth: 0,
            borderColor: "#777",
        }]
    }}

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 14,
                    }
                }
            }
        }
    }
    
    
    let generateRandomColors = ()=>{
        let i = 0;
        while(i<tagsMap.size){
            let r = Math.floor(Math.random()*256);
            let g = Math.floor(Math.random()*256);
            let b = Math.floor(Math.random()*256);
            let color = `rgba(${r},${g},${b},0.8)`;
            if(!colors.includes(color)){
                colors.push(color);
                i++;
            }
        }   

    }

    //below 1200 - newbie below-1400 pupil below 1600 specialist below 1900 expert below 2100 candidate master below 2300 master below 2400 international master below 2600 grandmaster below 3000 international grandmaster below 3200 legendary grandmaster
    //newbie - grey pupil - dark green specialist - cyan expert - blue candidate master - violet master - orange international master - red grandmaster - red international grandmaster - red legendary grandmaster - red just first letter of handle is black
    //please convert userInfo handle to particular color

    let userHandleColor; //should be in hex format

    if(userInfo.rank=="newbie"){
        userHandleColor = "#808080";
    }else if(userInfo.rank=="pupil"){
        userHandleColor = "#008000";
    }else if(userInfo.rank=="specialist"){
        userHandleColor = "#00FFFF";
    }else if(userInfo.rank=="expert"){
        userHandleColor = "#0000FF";
    }else if(userInfo.rank=="candidate master"){
        userHandleColor = "#EE82EE";
    }else if(userInfo.rank=="master"){
        userHandleColor = "#FFA500";
    }else if(userInfo.rank=="international master"){
        userHandleColor = "#FF0000";
    }else{
        userHandleColor = "#FF0000";
    }
    
    
    generateRandomColors();

    useEffect(()=>{
        getData();
        getUserInfo();
    },[])
    return (
        <div className="min-h-screen min-w-screen flex flex-col justify-center overflow-scroll items-center  font-poppins">




        <div className="flex sm:flex-col md:flex-row h-full w-full">
        <div className="flex flex-col justify-center items-center w-full min-h-[100%] my-4 px-2">
            <h1 className="my-2 font-bold text-3xl">Verdicts</h1>
            <div className=" min-w-[100%] min-h-[70%]  ">
            <Pie data={piechartdata.data} options={options} />
            </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full min-h-[100%] my-4 px-2">
            <h1 className="my-2 font-bold text-3xl">Languages Used</h1>
            <div className=" min-w-[100%] min-h-[70%]  ">
             <Pie data={piechartdata2.data} options={options} />
            </div>
        </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full min-h-[100%] my-4 px-2">
            <h1 className="my-2 font-bold text-3xl">Tags Solved</h1>
            <div className=" min-w-[100%] min-h-[70%]  ">
               <Doughnut data={donughtdata.data} options={options}/>
            </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full min-h-[100%] my-4 px-2">
            <h1 className="my-2 font-bold text-3xl">Rating-wise Submissions</h1>
            <div className=" min-w-[100%] min-h-[70%]  ">
            <Bar data={barChartData.data} options={{...options,plugins : {...options.plugins,legend : {...options.plugins.legend,position : "bottom"}}}} />
            </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full min-h-[100%] my-4 px-2">
            <h1 className="my-2 font-bold text-3xl">Index-wise Submissions</h1>
            <div className=" min-w-[100%] min-h-[70%]  ">
            <Bar data={barChartData2.data} options={{...options,plugins : {...options.plugins,legend : {...options.plugins.legend,position : "bottom"}}}} />
            </div>
        </div>
        <div>
            
            <div className="flex space-x-4 items-center justify-center">
                <p className="text-xl font-bold">Select Tag : </p>
            <div className="mt-1 mb-4">
<button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-black focus:outline-none  font-medium  text-sm px-5 py-2.5 text-center inline-flex items-center  border-b border-black" type="button">{selectedTag}<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" onClick={()=>setTagsShow(!tagsshow)} >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
{ tagsshow && <div id="dropdown" className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        {TagsDropdownItems.map((e,i)=>{
            return <li onClick={()=>{setSelectedTag(e); setTagsShow(!tagsshow)}} className="cursor-pointer">
                <p  key={i} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"  >{e}</p>
            </li>
        })}
    </ul>
</div>}
</div>
      <p className="text-xl font-bold"> Select Rating:</p>          
    <div className="mt-1 mb-4">
<button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-black focus:outline-none  font-medium  text-sm px-5 py-2.5 text-center inline-flex items-center  border-b border-black" type="button">{selectedRating}<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" onClick={()=>setRatingShow(!ratingshow)} >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
{ ratingshow && <div id="dropdown" className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        {RatingDropdownItems.map((e,i)=>{
            return <li onClick={()=>{setSelectedRating(e); setRatingShow(!ratingshow)}} className="cursor-pointer">
                <p  key={i} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"  >{e}</p>
            </li>
        })}
    </ul>
</div>}
</div>

 </div>
            {
                
                <div className="text-2xl font-bold flex justify-center max-h-[50%] overflow-scroll min-w-[100%]">
                <div className="flex flex-col max-w-[30%] min-h-[100%] overflow-scroll">
                <div className="text-xl font-bold">Solved</div>
                <div className="  max-h-[30%]  h-[15%] overflow-scroll py-4 px-4">
                    
                      {
                            tagLinks.map((e,i)=>{
                                return <a href={e} target="_blank" className="text-blue-500 hover:text-blue-700" key={i}>{" "+e.split("/").at(-2)+"-"+e.split("/").at(-1)+" "}</a>
                            })
                      }
                </div>
                </div>
                <div className=" max-w-[30%] max-h-[50%] overflow-scroll">
                    <div className="text-xl font-bold">Unsolved</div>
                <div className=" max-h-[30%]  h-[15%] overflow-scroll py-4 px-4">

                    {
                        unsolvedTagLinks.map((e,i)=>{
                            return <a href={e} target="_blank" className="text-red-500 hover:text-blue-700" key={i}>{" "+e.split("/").at(-2)+"-"+e.split("/").at(-1)+" "}</a>
                        })
                    }
                    {
                        !unsolvedTagLinks.length && <div className="text-md"> Nothing to show </div>
                    }
                    </div>
                </div>
                </div> 
            }
        </div>
        </div>
    );
}

export default Analyzer;