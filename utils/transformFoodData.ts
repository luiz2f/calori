import { MealItem } from '@/app/(authenticated)/layout'

export function transformFoodData(foodData: MealItem[] | undefined) {
  return foodData?.map(item => {
    const { food, unity, quantity } = item

    const carb = Math.round(food.carb * (quantity * unity.unitMultiplier))
    const prot = Math.round(food.protein * (quantity * unity.unitMultiplier))
    const fat = Math.round(food.fat * (quantity * unity.unitMultiplier))
    const kcal = Math.round((carb + prot) * 4 + fat * 9)

    return {
      name: food.name,
      carb: carb,
      prot: prot,
      fat: fat,
      kcal: kcal,
      quantity: quantity,
      unit: unity.un.replace(/"/g, '')
    }
  })
}
