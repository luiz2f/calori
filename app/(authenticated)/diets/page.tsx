import SelectedDiet from "@/components/by-page/diets/SelectedDiet";
import DietsSlider from "@/components/by-page/diets/DietsSlider";
import Header from "@/components/Header";

export default function DietPage() {
  return (
    <>
      <Header />
      <DietsSlider />
      <SelectedDiet />
    </>
  );
}
