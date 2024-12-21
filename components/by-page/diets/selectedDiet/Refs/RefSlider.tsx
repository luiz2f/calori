import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function RefSlider({ onLeft, onRight, length, current }) {
  const iconStyle = "w-5 h-5 ";
  if (length === 0) return null;
  return (
    <div className="flex w- p-2 justify-between text-darkgreen mt-1 mb-1 ">
      <div className="flex items-center w-20 cursor-pointer" onClick={onLeft}>
        {length > 1 && <HiChevronLeft className={iconStyle} />}
      </div>
      <div className="flex gap-2 items-center">
        <p>
          {current + 1}/{length}
        </p>
      </div>
      <div
        className="flex items-center w-20 justify-end cursor-pointer"
        onClick={onRight}
      >
        {length > 1 && <HiChevronRight className={iconStyle} />}
      </div>
    </div>
  );
}
