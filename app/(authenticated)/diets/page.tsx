import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import DietsSlider from "@/components/by-page/diets/DietsSlider";
import SelectedDiet from "@/components/by-page/diets/SelectedDiet";
import Header from "@/components/Header";
import { QueryClientProvider } from "./QueryClientProvider";

export const dynamic = "force-dynamic";

export default async function DietPage() {
  const diets = await getUserDiets();
  const empty = diets?.length === 0;
  const selectedDiet = diets?.[0];
  const meals = await getDietMeals(selectedDiet?.id);

  return (
    <QueryClientProvider>
      <Header />
      <DietsSlider initialDataDiets={diets} />
      <SelectedDiet serverData={{ empty, selectedDiet, meals, diets }} />
    </QueryClientProvider>
  );
}
