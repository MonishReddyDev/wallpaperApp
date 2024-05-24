import axios from "axios";

const API_KEY = "44024694-2404bc6e8b4fb36832b1f2ebe";
const Apiurl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatURL = (params) => {
  //{q,page,category ,order}
  let url = Apiurl + "&per_page=26&safesearch=true&editors_choice=true";
  if (!params) return url;
  let paramKeys = Object.keys(params);
  paramKeys.map((key) => {
    let value = key === "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  console.log("final URL", url);
  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatURL(params));
    const { data } = response;
    return { success: true, data: data };
  } catch (error) {
    console.log("ErrorOccured:", error.message);
    return { success: false, msg: error.message };
  }
};
