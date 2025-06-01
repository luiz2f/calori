import { transformFoodData } from '@/utils/transformFoodData'

describe('transformFoodData', () => {
  it('should correctly transform a list of MealItem', () => {
    const foodData = [
      {
        id: '1',
        foodId: '1',
        unityId: '1',
        mealListId: '1',
        food: { id: 'f1', name: 'Arroz', carb: 20, protein: 2, fat: 1 },
        unity: { unitMultiplier: 1, un: 'g', id: 'u1', foodId: '1' },
        quantity: 2
      },
      {
        id: '2',
        foodId: '2',
        unityId: '2',
        mealListId: '1',
        food: { id: 'f2', name: 'Feijão', carb: 15, protein: 5, fat: 0.5 },
        unity: { unitMultiplier: 0.5, un: '"ml"', id: 'u2', foodId: '2' },
        quantity: 3
      }
    ]

    const result = transformFoodData(foodData)

    expect(result).toEqual([
      {
        name: 'Arroz',
        carb: 40,
        prot: 4,
        fat: 2,
        kcal: 194,
        quantity: 2,
        unit: 'g'
      },
      {
        name: 'Feijão',
        carb: 23,
        prot: 8,
        fat: 1,
        kcal: 127,
        quantity: 3,
        unit: 'ml'
      }
    ])
  })

  it('should return undefined if input is undefined', () => {
    expect(transformFoodData(undefined)).toBeUndefined()
  })

  it('should handle empty array', () => {
    expect(transformFoodData([])).toEqual([])
  })
})
