"use client";
import { useState, useEffect } from "react";
import Menus from "@/components/ui/Menu";
import {
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import Modal from "@/components/ui/Modal";
import ConfirmDelete from "@/components/ui/ConfirmDelete";

export default function DietEditRefRow({
  refData,
  onRefChange,
  onErrorChange,
  nameError,
  timeError,
  onTimeBlur,
  onDelete,
  index,
}) {
  const [time, setTime] = useState(refData.time);
  const [name, setName] = useState(refData.name);
  useEffect(() => {
    onRefChange("name", name);
  }, [name]);

  useEffect(() => {
    onRefChange("time", time);
  }, [time]);

  useEffect(() => {
    onErrorChange("time", timeError);
  }, [timeError]);

  const handleTimeBlur = () => {
    let formattedTime = time;

    if (/^\d{4}$/.test(formattedTime)) {
      formattedTime = `${formattedTime.slice(0, 2)}:${formattedTime.slice(2)}`;
    }

    let [hours, minutes] = formattedTime.split(":");

    if (!hours || isNaN(Number(hours))) hours = "00";
    if (!minutes || isNaN(Number(minutes))) minutes = "00";

    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");

    if (Number(hours) > 24) {
      onErrorChange("time", "Horas não podem ser maiores que 24");
      return;
    }

    if (Number(minutes) > 59) {
      onErrorChange("time", "Minutos não podem ser maiores que 59");
      return;
    }

    setTime(`${hours}:${minutes}`);
    onErrorChange("time", "");
    onTimeBlur();
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    if (/^[0-9:]*$/.test(value)) {
      setTime(value);
    }
  };

  const handleDelete = () => {
    onDelete(refData.id);
  };

  return (
    <div key={refData.id} className="flex gap-2">
      <input
        name="refName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`border-1 w-full p-1 pl-2 rounded-lg ${
          nameError
            ? "border-darkred bg-lightred text-darkred"
            : "border-grey-50"
        }`}
        required
      />
      <input
        type="time"
        name="refTime"
        value={time}
        onChange={handleTimeChange}
        onBlur={handleTimeBlur}
        className={`border-1 w-20 text-center bg-white text-darkgreen p-1 rounded-lg font-medium ${
          timeError
            ? "border-darkred bg-lightred text-darkred"
            : "border-grey-50"
        }`}
      />

      <Modal.Open
        opens={`deleteRef${refData.id}${refData.name}${refData.time}`}
      >
        <button
          onClick={(e) => {
            {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          className="cursor-pointer border-1 border-grey-50 flex items-center justify-center  w-8 h-8 rounded-lg p-1"
        >
          <HiOutlineTrash />
        </button>
      </Modal.Open>
      <Modal.Window
        name={`deleteRef${refData.id}${refData.name}${refData.time}`}
      >
        <ConfirmDelete
          resource="Refeição"
          resourceName={`${refData.name} - ${refData.time}`}
          onConfirm={handleDelete}
          modalName={`deleteRef${refData.id}${refData.name}${refData.time}`}
        />
      </Modal.Window>
    </div>
  );
}
