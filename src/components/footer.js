
function Footer() {
  const d = new Date();
  let year = d.getFullYear();
    return (
      <div className=" bg-black text-white h-[40%] flex items-center flex-col font-poppins justify-center">
        <h1 className=" mt-4 text-sm " > Copyright © {year} </h1>
        <h1 className=" my-2" > Connect With Me : </h1>
        <div className="mb-4" >
          {/* <a ><img src="\assets\linkedin.png"></img></a> |
          <a> Github </a>   |
          <a> INStagram </a>| */}
        </div>
      </div>
    );
  }
  
export default Footer;
  