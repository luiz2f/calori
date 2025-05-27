import { MealVarMacro } from '@/app/context/useMacroContext'

export const calculateMacros = (variation: MealVarMacro) => {
  let carb = 0
  let prot = 0
  let fat = 0
  let kcal = 0
  if (!!variation?.mealListItems?.length) {
    variation.mealListItems.forEach(item => {
      carb +=
        (item?.food?.carb ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
      prot +=
        (item?.food?.protein ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
      fat +=
        (item?.food?.fat ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0)
    })

    kcal = Math.round((carb + prot) * 4 + fat * 9)
    carb = Math.round(carb)
    prot = Math.round(prot)
    fat = Math.round(fat)
  }

  return { carb, prot, fat, kcal }
}
