import NavButton from "@/components/ui/NavButton";
import { HiOutlineX } from "react-icons/hi";

export default function ErrorPage({
  title = "Erro",
  subtitle = "Um erro inesperado ocorreu",
  children = <NavButton href="/">Voltar</NavButton>,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full justify-between items-center">
      <div className="flex flex-col items-center h-full justify-center">
        <HiOutlineX className="w-8 h-8 mb-4 text-darkred align-middle" />
        <h1 className="text-2xl w-full text-center font-bold mb-2">{title} </h1>
        <h4 className="text-xl text-darkred w-full text-center mb-6">
          {subtitle}
        </h4>
      </div>

      <div className="flex flex-col w-full mb-4">{children}</div>
    </div>
  );
}
