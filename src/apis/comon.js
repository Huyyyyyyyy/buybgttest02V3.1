import axios from "axios";
const BASE_URL = "https://heybgt.xyz";
export const allOrderList = async (params) => {
  let res;
  const { page, size, state, type } = params;
  try {
    const response = await axios.get(
      `${BASE_URL}/bot/bgtpool/allOrderList?page=${page}&size=${size}&state=${state}&type=${type}`
    );
    if (response.status == 200) {
      res = response.data.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};
