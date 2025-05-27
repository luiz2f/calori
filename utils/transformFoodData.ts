import { MealItem } from '@/app/(authenticated)/layout'

export function transformFoodData(foodData: MealItem[] | undefined) {
  return foodData?.map(item => {
    const { food, unity, quantity } = item

    const carb = food.carb * (quantity * unity.unitMultiplier)
    const prot = food.protein * (quantity * unity.unitMultiplier)
    const fat = food.fat * (quantity * unity.unitMultiplier)
    const kcal = Math.round((carb + prot) * 4 + fat * 9)

    return {
      name: food.name,
      carb: Math.round(carb),
      prot: Math.round(prot),
      fat: Math.round(fat),
      kcal: kcal,
      quantity: quantity,
      unit: unity.un.replace(/"/g, '')
    }
  })
}
