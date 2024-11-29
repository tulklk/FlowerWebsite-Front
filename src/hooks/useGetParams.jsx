import { useLocation } from "react-router-dom";
function useGetParams(){
    const location =useLocation();
    const getParams =(params)=>{
        const data =new URLSearchParams(location.search);
        return data.get(params);
    };
    return getParams; 
}
export default useGetParams;

// how to use
// const getParam=useGetParams();
//const myParam= getParams("id");