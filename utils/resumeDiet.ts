import { DietFromSlider } from '@/app/(authenticated)/layout'

export const resumeDiet = (data: DietFromSlider) => {
  return {
    id: data?.id,
    name: data?.name,
    userId: data?.userId,
    index: data?.index,
    meals: (data?.meals || [])
      .filter(meal => meal.hasOwnProperty('mealList'))
      .map(meal => ({
        id: meal.id,
        name: meal.name,
        time: meal.time,
        dietId: meal.dietId
      }))
  }
}
