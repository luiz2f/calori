import DietsSlider from '@/components/by-page/diets/DietsSlider'
import SelectedDiet from '@/components/by-page/diets/SelectedDiet'
import Header from '@/components/Header'
import { generateInitialData } from '../layout'

export default async function DietPage() {
  const { defaultDiet, diets } = await generateInitialData()

  return (
    <>
      <Header />
      <DietsSlider initialDataDiets={diets} />
      <SelectedDiet defaultDiet={defaultDiet} />
    </>
  )
}
