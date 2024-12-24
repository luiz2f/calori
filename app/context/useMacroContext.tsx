"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

const MacroContext = createContext();

export const MacroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [macros, setMacros] = useState([]);
  const [totalMacros, setTotalMacros] = useState({
    carb: 0,
    protein: 0,
    fat: 0,
  });

  const updateMacroForMeal = (mealId, macro) => {
    console.log("Updating macros for meal:", mealId, macro);
    setMacros((prevMacros) => {
      const updatedMacros = [...prevMacros];
      const index = updatedMacros.findIndex((m) => m.mealId === mealId);
      if (index !== -1) {
        updatedMacros[index] = { mealId, macro };
      } else {
        updatedMacros.push({ mealId, macro });
      }
      console.log("Updated Macros:", updatedMacros);
      return updatedMacros;
    });
  };

  useEffect(() => {
    console.log("Macros State Before Reducing:", macros);
    const newTotalMacros = macros.reduce(
      (totals, { macro }) => {
        console.log("Current Macro in Reduction:", macro);
        totals.carb += Math.round(macro?.carbo || 0);
        totals.protein += Math.round(macro?.prot || 0);
        totals.fat += Math.round(macro?.gord || 0);
        console.log("Intermediate Totals:", totals);
        return totals;
      },
      { carb: 0, protein: 0, fat: 0 }
    );
    console.log("New Total Macros:", newTotalMacros);
    setTotalMacros(newTotalMacros);
  }, [macros]);

  const calculateColumns = (macros: { [key: string]: number }[]) => {
    const sizePadrao = 24;
    const sizeBase = 12;
    const sizeExtra = 1.4;

    const getMaxDigitsForMacroGroup = () => {
      const maxCarbDigits = Math.max(
        ...macros.map((m) => m.macro.carbo?.toString().length || 0)
      );
      const maxProtDigits = Math.max(
        ...macros.map((m) => m.macro.prot?.toString().length || 0)
      );
      const maxFatDigits = Math.max(
        ...macros.map((m) => m.macro.gord?.toString().length || 0)
      );

      // Encontrar o maior número de dígitos entre carbo, proteína e gordura
      const maxMacroDigits = Math.max(
        maxCarbDigits,
        maxProtDigits,
        maxFatDigits
      );
      return maxMacroDigits;
    };
    const maxDigits = getMaxDigitsForMacroGroup();

    // Função para calcular o tamanho da coluna baseado no número de dígitos
    const calculateColumnSize = (maxDigits: number) => {
      if (maxDigits === 1) return sizePadrao;
      return sizeBase + sizeExtra * (maxDigits - 1);
    };

    // Calculando o tamanho da coluna baseado no maior valor de dígitos entre carbo, proteína e gordura
    const macroColumnSize = calculateColumnSize(maxDigits);
    const kcalColumnSize = calculateColumnSize(
      Math.max(...macros.map((m) => m.macro.kcal?.toString().length || 0))
    ); // Coluna de calorias

    // Gerando a string para o estilo de colunas
    return `1fr ${macroColumnSize}px ${macroColumnSize}px ${macroColumnSize}px ${
      kcalColumnSize + 4
    }px `;
  };
  // Calculando a string de colunas
  const columns = calculateColumns(macros);

  return (
    <MacroContext.Provider
      value={{ macros, updateMacroForMeal, totalMacros, columns }}
    >
      {children}
    </MacroContext.Provider>
  );
};

export const useMacroContext = () => {
  const context = useContext(MacroContext);
  if (!context) {
    throw new Error("useMacroContext must be used within a MacroProvider");
  }
  return context;
};
