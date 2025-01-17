'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

type DietProviderProps = {
  children: ReactNode
  initialDiet: string | null
}

type DietContextType = {
  selectedDiet: string
  setSelectedDiet: React.Dispatch<React.SetStateAction<string>>
}

const DietContext = createContext<DietContextType | null>(null)

export const DietProvider: React.FC<DietProviderProps> = ({
  children,
  initialDiet
}) => {
  const [selectedDiet, setSelectedDiet] = useState<string>(
    initialDiet ? initialDiet : ''
  )
  // const [meals, setMeals] = useState<any[]>([]);

  return (
    <DietContext.Provider
      value={{
        selectedDiet,
        setSelectedDiet
        // meals,
        // setMeals,
      }}
    >
      {children}
    </DietContext.Provider>
  )
}

export const useDietContext = () => {
  const context = useContext(DietContext)
  if (!context) {
    throw new Error('useDietContext must be used within a DietProvider')
  }
  return context
}
