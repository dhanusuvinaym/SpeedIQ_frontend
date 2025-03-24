import axios from "axios";
import { clearCookies, getCookie } from "../Cookies/GetCookies";
import { now } from "../DateTime";
import enums from "./ApiList";



// console.log("jwtToken ====== ", jwtToken);

// console.log("isdemo === ", isdemo, getCookie('isdemo'))

export const getApi = async (apiUrl) => {

  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  const response = await axios.get(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo !== null ? String(isdemo) : "false"
    }
  });
  return response.data;
};

// POST Request
export const postApi = async (apiUrl, apiRequestBody) => {

  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  // try {
  const response = await axios.post(apiUrl, apiRequestBody, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo !== null ? String(isdemo) : "false"
    }
  });
  return response.data;
  // } catch (error) {
  //   console.error("POST request error:", apiUrl, error);
  // }
};

// PUT Request
export const putApi = async (apiUrl, apiRequestBody) => {

  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  // try {
  const response = await axios.put(apiUrl, apiRequestBody, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo !== null ? String(isdemo) : "false"
    }
  });
  return response.data;
  // } catch (error) {
  //   console.error("PUT request error:", apiUrl, error);
  // }
};

// PATCH Request
export const patchApi = async (apiUrl, apiRequestBody) => {

  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  const response = await axios.patch(apiUrl, apiRequestBody, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo !== null ? String(isdemo) : "false"
    }
  });
  return response.data;
};

// DELETE Request
export const deleteApi = async (apiUrl) => {
  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  console.log("jwtToken in deleteApi ",jwtToken)
  console.log("isdemo in deleteApi ",isdemo)

  const response = await axios.delete(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo ? String(isdemo) : "false"
    }
  });
  return response.data;
};


export const inVallidateUser = async () => {
  const jwtToken = getCookie('jwtToken')
  const isdemo = getCookie('isdemo') === 'true'

  const requestJson = {
    id: parseInt(getCookie('id')),
    mobileNumber:getCookie('username'),
    tokenId: getCookie('tokenId'),
    isvalid: false,
    activity_date: now(),
  }

  axios.put(enums.BASE_URL + enums.ENDPOINTS.LOGIN.UPDATE + requestJson.id, requestJson, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Demo": isdemo !== null ? String(isdemo) : "false"
    }
  }).then(data => {
    if (data) {
      // clearCookies();
    }
  }).catch(exception => {
    console.error("Exception while invalidating the User ", exception);
  })
};
