'use client'

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import { MealItem } from '../(authenticated)/layout'

export type Macro = {
  carb: number
  prot: number
  fat: number
  kcal: number
}
export type MealVarMacro = {
  id: string
  name: string
  mealListItems: MealItem[] | []
  macro?: Macro
}
export type MealMacro = {
  dietId: string
  id: string
  name: string
  time: string
  mealList: MealVarMacro[] | []
}
export type SelectedDietMacro = {
  id: string
  name: string
  userId: string
  meals: MealMacro[] | []
}

type mealMacro = {
  mealId: string
  macro: Macro
}
type MacroContextType = {
  macros: mealMacro[] | []
  updateMacroForMeal: (mealId: string, macro: Macro | undefined) => void
  setDefaultMacro: (data: SelectedDietMacro) => void
  totalMacros: Macro
  columns: string | null
}
type DataItem = {
  macro: Macro
}

const MacroContext = createContext<MacroContextType | null>(null)

export const MacroProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [macros, setMacros] = useState<mealMacro[]>([])
  const [totalMacros, setTotalMacros] = useState<Macro>({
    carb: 0,
    prot: 0,
    fat: 0,
    kcal: 0
  })

  const setDefaultMacro = (data: SelectedDietMacro) => {
    const newData = data?.meals
    setMacros([])
    newData?.forEach(meal => {
      if (!meal?.mealList?.length) {
        return
      }
      updateMacroForMeal(meal?.id, meal?.mealList[0]?.macro)
    })
  }

  const updateMacroForMeal = (
    mealId: string,
    macro: Macro | undefined
  ): void => {
    if (!macro) {
      return
    }
    setMacros(prevMacros => {
      const updatedMacros = [...prevMacros]
      const index = updatedMacros.findIndex(m => m?.mealId === mealId)
      if (index !== -1) {
        updatedMacros[index] = { mealId, macro }
      } else {
        updatedMacros.push({ mealId, macro })
      }
      return updatedMacros
    })
  }

  useEffect(() => {
    const newTotalMacros = macros.reduce(
      (totals, { macro }) => {
        totals.carb += macro?.carb || 0
        totals.prot += macro?.prot || 0
        totals.fat += macro?.fat || 0
        return totals
      },
      { carb: 0, prot: 0, fat: 0, kcal: 0 }
    )

    const roundedTotalMacros = {
      carb: Math.round(newTotalMacros.carb),
      prot: Math.round(newTotalMacros.prot),
      fat: Math.round(newTotalMacros.fat),
      kcal: Math.round(
        (newTotalMacros.carb + newTotalMacros.prot) * 4 + newTotalMacros.fat * 9
      )
    }

    // Verifique se os valores realmente mudaram antes de atualizar o estado
    if (
      totalMacros.carb !== roundedTotalMacros.carb ||
      totalMacros.prot !== roundedTotalMacros.prot ||
      totalMacros.fat !== roundedTotalMacros.fat ||
      totalMacros.kcal !== roundedTotalMacros.kcal
    ) {
      setTotalMacros({ ...roundedTotalMacros })
    }
  }, [macros, totalMacros])

  const calculateColumns = useCallback(
    (data: DataItem[]) => {
      const sizePadrao = 32
      const sizeBase = sizePadrao
      const sizeExtra = 2
      const getMaxDigitsForMacroGroup = () => {
        const maxCarbDigits = Math.max(
          ...data.map(m =>
            m?.macro?.carb != null ? m?.macro?.carb.toString().length : 0
          )
        )
        const maxProtDigits = Math.max(
          ...data.map(m =>
            m?.macro?.prot != null ? m?.macro?.prot.toString().length : 0
          )
        )
        const maxFatDigits = Math.max(
          ...data.map(m =>
            m?.macro?.fat != null ? m?.macro?.fat.toString().length : 0
          )
        )

        const maxMacroDigits = Math.max(
          maxCarbDigits,
          maxProtDigits,
          maxFatDigits
        )

        return maxMacroDigits
      }

      if (data.length === 0) {
        return null
      }

      const maxDigits = getMaxDigitsForMacroGroup()

      const calculateColumnSize = (maxDigits: number) => {
        if (maxDigits === 2) return sizePadrao
        return sizeBase + sizeExtra * (maxDigits - 1)
      }

      const macroColumnSize = calculateColumnSize(maxDigits)

      const kcalColumnSize = macros.some(m => m?.macro?.kcal != null)
        ? calculateColumnSize(
            Math.max(
              ...macros.map(m =>
                m?.macro?.kcal != null ? m?.macro?.kcal.toString().length : 0
              )
            )
          )
        : sizePadrao

      return `1fr ${macroColumnSize}px ${macroColumnSize}px ${macroColumnSize}px ${kcalColumnSize}px`
    },
    [macros]
  )
  // Calculando a string de colunas
  const columns = useMemo(
    () => calculateColumns(macros),
    [calculateColumns, macros]
  )

  return (
    <MacroContext.Provider
      value={{
        macros,
        updateMacroForMeal,
        setDefaultMacro,
        totalMacros,
        columns
      }}
    >
      {children}
    </MacroContext.Provider>
  )
}

export const useMacroContext = () => {
  const context = useContext(MacroContext)
  if (!context) {
    throw new Error('useMacroContext must be used within a MacroProvider')
  }
  return context
}
