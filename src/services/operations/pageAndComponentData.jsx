import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';


export const getCatalogPageData = async(categoryId) => {
  let result = [];
  try{  
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,  {categoryId: categoryId});
        console.log("category response", response);
        
        result = response?.data;

        if(!response?.data?.success){
          throw new Error("Could not Fetch Category page data");
      }
  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error( error.response?.data?.message || error.message || "An unexpected error occurred.");
    result = error.response?.data;
  }
  return result;
}

 