import axios from "axios";
import { BASE_HEY_BGT_URL } from "../const/const";

//get all orders from market
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
      `${BASE_HEY_BGT_URL}/bot/bgtpool/allOrderList?page=${page}&size=${size}&state=${state}&type=${type}&orderBy=${orderBy}`
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

//get all orders from specifit account
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
      `${BASE_HEY_BGT_URL}/bot/bgtpool/allOrderList?address=${address}&page=${page}&size=${size}&state=${state}&type=${type}&orderBy=${orderBy}`
    );
    if (response.status == 200) {
      res = response.data.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};

//get all vaults
export const allVaultsList = async () => {
  let res;
  try {
    const response = await axios.get(
      `${BASE_HEY_BGT_URL}/bot/bgtpool/vaultlist`
    );
    if (response.status == 200) {
      res = response.data;
    }
  } catch (e) {
    res = e;
  }
  return res;
};
