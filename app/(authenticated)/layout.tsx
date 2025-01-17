import { getUserDiets } from '@/actions/diets/diets'
import { getDietMeals } from '@/actions/diets/meals'
import { getFoods } from '@/actions/foods'
import App from './app'

export const dynamic = 'force-dynamic'

export type MealFromSlider = {
  id: string
  name: string
  time: string
  dietId: string
}
export type DietFromSlider = {
  id: string
  index: number
  name: string
  userId: string
  meals: MealFromSlider[] | []
}
export type DietsSlider = DietFromSlider[] | []

export type FoodFromItem = {
  carb: number
  protein: number
  fat: number
  id: string
  name: string
}
export type UnityFromItem = {
  foodId: string
  id: string
  un: string
  unitMultiplier: number
}
export type MealItem = {
  id: string
  foodId: string
  unityId: string
  quantity: number
  mealListId: string
  food: FoodFromItem
  unity: UnityFromItem
}
export type MealVar = {
  id: string
  name: string
  mealListItems: MealItem[] | []
}
export type Meal = {
  dietId: string
  id: string
  name: string
  time: string
  mealList: MealVar[] | []
}
export type SelectedDiet = {
  id: string
  name: string
  userId: string
  meals: Meal[] | []
}

export type Unity = {
  id: string
  foodId: string
  un: string
  unitMultiplier: number
}
export type Food = {
  id: string
  name: string
  carb: number
  protein: number
  fat: number
  satFat: number
  fiber: number
  userFood: boolean
  unities: Unity[]
}
export async function generateInitialData() {
  const diets = (await getUserDiets()) || []
  const selectedDietId = diets?.[0]?.id || null
  const defaultDiet = selectedDietId ? await getDietMeals(selectedDietId) : null
  const foods = await getFoods()
  return { defaultDiet, diets, foods }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { defaultDiet, diets, foods } = await generateInitialData()

  return (
    <App defaultDiet={defaultDiet} diets={diets} foods={foods}>
      {children}
    </App>
  )
}
