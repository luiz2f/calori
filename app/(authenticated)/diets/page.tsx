import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import App from "./app";

export const dynamic = "force-dynamic";

export default async function DietPage() {
  const diets = await getUserDiets();
  const empty = diets?.length === 0;
  const selectedDiet = diets?.[0];
  const defaultDiet = await getDietMeals(selectedDiet?.id);
  return <App empty={empty} defaultDiet={defaultDiet} diets={diets} />;
}
