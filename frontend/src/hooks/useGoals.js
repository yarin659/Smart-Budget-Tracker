import { useContext } from "react";
import { GoalsContext } from "../context/GoalsContext";

export const useGoals = () => useContext(GoalsContext);
