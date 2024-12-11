import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function RefSlider() {
  const iconStyle = "w-5 h-5 ";

  return (
    <div className="flex w-full p-2 justify-between text-darkgreen mt-4 ">
      <div className="flex items-center w-20 ">
        <HiChevronLeft className={iconStyle} />
      </div>
      <div className="flex gap-2 items-center">
        <p>1/10</p>
      </div>
      <div className="flex items-center w-20 justify-end">
        <HiChevronRight className={iconStyle} />
      </div>
    </div>
  );
}
