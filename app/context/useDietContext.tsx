"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface DietProviderProps {
  children: ReactNode;
  initialDiet: string;
}

const DietContext = createContext<{
  selectedDiet: string;
  setSelectedDiet: React.Dispatch<React.SetStateAction<string>>;
  meals: any[];
  setMeals: React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

export const DietProvider: React.FC<DietProviderProps> = ({
  children,
  initialDiet,
}) => {
  const [selectedDiet, setSelectedDiet] = useState(initialDiet);
  const [meals, setMeals] = useState<any[]>([]);

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
