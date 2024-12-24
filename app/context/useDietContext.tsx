"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

const DietContext = createContext();

export const DietProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [meals, setMeals] = useState([]);

  return (
    <DietContext.Provider
      value={{
        selectedDiet,
        setSelectedDiet,
        meals,
        setMeals,
      }}
    >
      {children}
    </DietContext.Provider>
  );
};

export const useDietContext = () => {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error("useDietContext must be used within a DietProvider");
  }
  return context;
};
