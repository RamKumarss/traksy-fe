import { NAME_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/constant";
import { useEffect, useState } from "react";
import { addUser } from "./api";
import { getData, removeData, storeData } from "./storage";

export function useAuth() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      const storedName = await getData(USER_STORAGE_KEY);
      console.log("Stored user name:", storedName);
      setUserName(storedName);
    } catch (error) {
      console.error("Error checking user login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (name: string) => {
    try {
     const userAdd = await addUser(name);
     console.log("User added response:", userAdd);
      await storeData(USER_STORAGE_KEY, userAdd.data._id);
      await storeData(NAME_STORAGE_KEY, userAdd.data.name);
      setUserName(name.trim());
    } catch (error) {
      console.error("Error saving user name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeData(USER_STORAGE_KEY);
      setUserName(null);
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  return {
    userName,
    isLoading,
    login,
    logout,
  };
}
