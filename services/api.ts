import { API_URL, NAME_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/constant";
import * as Location from "expo-location";
import { getData } from "./storage";

export const usersArrivalData = async () => {
  try {
    const res = await fetch(`${API_URL}/locationData/getArrivalListData`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching arrival data:", error);
    return error;
  }
};

export const fetchDistanceData = async () => {
  try {
    // Get location
    let { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
    const response = await fetch(
      `${API_URL}/locationData/distance?lat=${latitude}&lng=${longitude}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json; // store response in state
  } catch (err: any) {
    return err.message;
  }
};

export const sendLocationData = async (googleData: any) => {
  try {
    const userName = await getData(NAME_STORAGE_KEY);
    const res = await fetch(`${API_URL}/locationData/updateArrivalListData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        distance: googleData.rows[0].elements[0].distance.text,
        duration: googleData.rows[0].elements[0].duration_in_traffic.text,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error sending location data:", error);
    return;
  }
};

export const addUser = async (name: string) => {
  try {
    const user = await fetch(`${API_URL}/user/addUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role: "user",
      }),
    });
    return await user.json();
  } catch (error) {
    console.error("Error adding user:", error);
    return;
  }
};

export const getUserData = async () => {
  try {
    const userId = await getData(USER_STORAGE_KEY);
    const user = await fetch(`${API_URL}/user/getUser/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await user.json();
  } catch (error) {
    console.error("Error adding user:", error);
    return;
  }
};
