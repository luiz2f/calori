import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import App from "./app";
import { getFoods } from "@/actions/foods";

export const dynamic = "force-dynamic";

export default async function DietPage() {
  const diets = await getUserDiets();
  const empty = diets?.length === 0;
  const selectedDiet = diets?.[0];
  const defaultDiet = await getDietMeals(selectedDiet?.id);
  const foods = await getFoods();
  return (
    <App empty={empty} defaultDiet={defaultDiet} diets={diets} foods={foods} />
  );
}
