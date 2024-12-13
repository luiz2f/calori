import SelectedDiet from "@/components/by-page/diets/SelectedDiet";
import DietsSlider from "@/components/by-page/diets/DietsSlider";
import Header from "@/components/Header";
const diets = [
  {
    name: "Dieta A Nome muito grande exemssssssssssssssssssssplo",
    index: 2,
    kcal: 2321,
    carbo: 125,
    protein: 123,
    fat: 23,
  },
  { name: "Dieta B", index: 3, kcal: 1721 },
  { name: "Dieta C", index: 4, kcal: 1721 },
  { name: "Dieta D", index: 1, kcal: 2128 },
];

export default function DietPage() {
  return (
    <>
      <Header />
      <DietsSlider />
      <SelectedDiet />
    </>
  );
}
