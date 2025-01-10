import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import { getFoods } from "@/actions/foods";
import App from "./app";

export const dynamic = "force-dynamic";

export async function generateInitialData() {
  const diets = await getUserDiets();
  if (!diets)
    return {
      defaultDiet: null,
      diets: [],
      foods: [],
    };
  const selectedDiet = diets?.[0];
  const defaultDiet = await getDietMeals(selectedDiet?.id);
  const foods = await getFoods();
  return { defaultDiet, diets, foods };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { defaultDiet, diets, foods } = await generateInitialData();

  return (
    <App defaultDiet={defaultDiet} diets={diets} foods={foods}>
      {children}
    </App>
  );
}
