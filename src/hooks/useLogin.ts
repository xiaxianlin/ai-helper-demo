import axios from "axios";
import { useRequest } from "ahooks";

export const useLogin = (device: string) => {
  const {
    data: token,
    loading,
    refresh,
  } = useRequest(async () => {
    const res = await axios({
      url: "http://127.0.0.1:8000/api/device/login",
      method: "POST",
      headers: { "x-access-token": localStorage.getItem("token") ?? "", "x-device-address": device },
    });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data.token as string;
  });
  return {
    token,
    loading,
    refresh,
  };
};
