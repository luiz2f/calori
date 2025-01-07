import { getUserDiets } from "@/actions/diets/diets";
import { getDietMeals } from "@/actions/diets/meals";
import { getFoods } from "@/actions/foods";
import App from "./app";

export const dynamic = "force-dynamic";

export async function generateInitialData() {
  const diets = await getUserDiets();
  const empty = diets?.length === 0;
  const selectedDiet = diets?.[0];
  const defaultDiet = await getDietMeals(selectedDiet?.id);
  const foods = await getFoods();
  return { empty, defaultDiet, diets, foods };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { empty, defaultDiet, diets, foods } = await generateInitialData();

  return (
    <App empty={empty} defaultDiet={defaultDiet} diets={diets} foods={foods}>
      {children}
    </App>
  );
}
