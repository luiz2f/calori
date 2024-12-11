import { IoPersonCircleOutline } from "react-icons/io5";
import Logo from "./ui/Logo";

export default function Header() {
  return (
    <div className="bg-white fixed h-14 w-full border-b-2 border-lightgreen flex  items-center justify-center z-50">
      <div className="w-32 m-auto">
        <Logo />
      </div>
      {/* TODO ONCLICK */}
      <div className="absolute right-2 top-50% text-2xl text-grey40">
        <IoPersonCircleOutline className="w-7 h-7 " />
      </div>
    </div>
  );
}
