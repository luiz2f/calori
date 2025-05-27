import { calculateMacros } from '@/utils/calculateMacros'
import { MealVarMacro } from '@/app/context/useMacroContext'

describe('calculateMacros', () => {
  it('should correctly calculate macros for a meal variation with multiple items', () => {
    const mockVariation: MealVarMacro = {
      mealListItems: [
        {
          food: { carb: 20, protein: 10, fat: 5 },
          quantity: 2,
          unity: { unitMultiplier: 1 }
        },
        {
          food: { carb: 15, protein: 5, fat: 10 },
          quantity: 1,
          unity: { unitMultiplier: 0.5 }
        }
      ]
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 48, // (20 * 2) + (15 * 1 * 0.5) = 40 + 7.5 = 47.5 Round 48
      prot: 23, // (10 * 2) + (5 * 1 * 0.5) = 20 + 2.5 = 22.5 Round 23
      fat: 15, // (5 * 2) + (10 * 1 * 0.5) = 10 + 5 = 15
      kcal: 415 // (carb + prot) * 4 + fat * 9 = 419
    })
  })

  it('should return 0 for all macros when the item list is empty', () => {
    const mockVariation: MealVarMacro = {
      mealListItems: []
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 0,
      prot: 0,
      fat: 0,
      kcal: 0
    })
  })

  it('should return 0 for all macros when mealListItems is undefined', () => {
    const mockVariation = {
      mealListItems: []
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 0,
      prot: 0,
      fat: 0,
      kcal: 0
    })
  })

  it('should ignore items with null or undefined values', () => {
    const mockVariation: MealVarMacro = {
      mealListItems: [
        {
          food: { carb: 20, protein: 10, fat: 5 },
          quantity: 2,
          unity: { unitMultiplier: 1 }
        },
        {
          food: null,
          quantity: 1,
          unity: { unitMultiplier: 1 }
        },
        {
          food: { carb: 15, protein: 5, fat: 10 },
          quantity: null,
          unity: { unitMultiplier: 1 }
        }
      ]
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 40,
      prot: 20,
      fat: 10,
      kcal: 330
    })
  })

  it('should correctly calculate macros when there is only one item in the list', () => {
    const mockVariation: MealVarMacro = {
      mealListItems: [
        {
          food: { carb: 30, protein: 20, fat: 10 },
          quantity: 1,
          unity: { unitMultiplier: 1 }
        }
      ]
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 30,
      prot: 20,
      fat: 10,
      kcal: 290 // (carb + prot) * 4 + fat * 9 = (30 + 20) * 4 + 10 * 9 = 290
    })
  })

  it('should return 0 for all macros when quantity or unitMultiplier is 0', () => {
    const mockVariation: MealVarMacro = {
      mealListItems: [
        {
          food: { carb: 30, protein: 20, fat: 10 },
          quantity: 0,
          unity: { unitMultiplier: 1 }
        },
        {
          food: { carb: 15, protein: 10, fat: 5 },
          quantity: 1,
          unity: { unitMultiplier: 0 }
        }
      ]
    } as unknown as MealVarMacro

    const result = calculateMacros(mockVariation)

    expect(result).toEqual({
      carb: 0,
      prot: 0,
      fat: 0,
      kcal: 0
    })
  })
})
