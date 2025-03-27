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

export const allOrderListAccount = async (params) => {
  let res;
  const { page, size, state, type, address } = params;
  const orderBy = "amount desc, bgt_amount desc";
  try {
    const response = await axios.get(
      `${BASE_URL}/bot/bgtpool/allOrderList?address=${address}&page=${page}&size=${46}&state=${state}&type=${-1}&orderBy=${orderBy}`
    );
    if (response.status == 200) {
      res = response.data.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};
