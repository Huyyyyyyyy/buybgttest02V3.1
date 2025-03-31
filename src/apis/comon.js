import axios from "axios";
const BASE_URL = "https://heybgt.xyz";
export const allOrderList = async (params) => {
  let res;
  const { page, size, state, type } = params;
  let orderBy = "";
  if (type == 2) {
    orderBy = "markup desc, state asc";
  } else {
    orderBy = "amount desc, bgt_amount desc, state asc";
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/bot/bgtpool/allOrderList?page=${page}&size=${size}&state=${state}&type=${type}&orderBy=${orderBy}`
    );
    if (response.status == 200) {
      res = response.data.data;
      console.log(res);
    }
  } catch (e) {
    res = e;
  }
  return res;
};

export const allOrderListAccount = async (params) => {
  let res;
  const { page, size, state, type, address } = params;
  let orderBy = "";
  if (type == 2) {
    orderBy = "markup desc, state asc";
  } else {
    orderBy = "amount desc, bgt_amount desc, state asc";
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/bot/bgtpool/allOrderList?address=${address}&page=${page}&size=${size}&state=${state}&type=${type}&orderBy=${orderBy}`
    );
    if (response.status == 200) {
      res = response.data.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};

export const allVaultsList = async () => {
  let res;
  try {
    const response = await axios.get(
      `${BASE_URL}/bot/bgtpool/vaultlist`
    );
    if (response.status == 200) {
      res = response.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};
