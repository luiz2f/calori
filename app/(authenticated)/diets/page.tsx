import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import DietsSlider from "@/components/by-page/diets/DietsSlider";
import SelectedDiet from "@/components/by-page/diets/SelectedDiet";
import Header from "@/components/Header";
import { generateInitialData } from "../layout";

export default async function DietPage() {
  const { empty, defaultDiet, diets } = await generateInitialData();

  return (
    <>
      <Header />
      <DietsSlider initialDataDiets={diets} />
      <SelectedDiet serverData={{ empty, defaultDiet, diets }} />
    </>
  );
}
