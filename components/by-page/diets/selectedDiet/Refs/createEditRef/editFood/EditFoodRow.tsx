"use client";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import { useState, useEffect, useCallback } from "react";
import {
  HiDotsVertical,
  HiOutlineDuplicate,
  HiOutlineTrash,
} from "react-icons/hi";
import Select from "react-select";

export default function EditFoodRow({
  createFood,
  createReturn,
  cleanReturn,
  mealId,
  food,
  foods,
  onFoodChange,
  onDeleteFood,
  duplicateFood,
  foodReturned,
  foodOptions,
}) {
  const unityDefault = {
    value: food.unity.id,
    label: food.unity.un,
  };
  const foodDefault = {
    value: food.food.id,
    label: food.food.name,
  };

  const [selectedFood, setSelectedFood] = useState(foodDefault || null);
  const [selectedUnity, setSelectedUnity] = useState(unityDefault || null);
  const foodInfo = foods?.find((obj) => obj?.id === selectedFood?.value);
  const unityInfo =
    foodInfo?.unities?.find((unity) => unity?.foodId === selectedFood?.value) ||
    {};
  const [quantity, setQuantity] = useState(food.quantity || 0);
  const unityOptions =
    foodOptions?.find((obj) => obj.value === selectedFood?.value)?.unities ||
    [];
  useEffect(() => {
    if (selectedFood.value) {
      onFoodChange(food.id, { foodInfo, unityInfo, quantity });
    }
  }, [selectedFood, selectedUnity, quantity, food.id]);

  const handleFoodChange = useCallback(
    (selected) => {
      if (selected.value === "create-food") {
        createFood();
        createReturn();
      } else {
        setSelectedFood(selected);
        setSelectedUnity(selected.unities[0]);
      }
    },
    [createFood, createReturn, setSelectedFood, setSelectedUnity]
  );

  const handleUnityChange = (selected) => {
    setSelectedUnity(selected);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    if (foodReturned) {
      const created = foodOptions?.find((obj) => obj.value === foodReturned);
      handleFoodChange(created);
      cleanReturn();
    }
  }, [foodReturned, handleFoodChange, foodOptions, cleanReturn]);

  const selectStyle = {
    indicatorsContainer: (base) => ({
      ...base,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px 0 0",
      width: "18px",
    }),
    control: (base) => ({
      ...base,
      borderColor: "#d1d1d1",
      borderWidth: "1px",
      padding: "0",
      textAlign: "center",
      minHeight: "25px",
      width: "100%",
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: "center",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#d1d1d1",
      top: "auto",
      bottom: "100%",
      zIndex: 6000,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 6000,
      transform: "translateX(-4vw)",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: state.isSelected ? "4px" : "0",

      backgroundColor: state.isSelected
        ? "#76C163"
        : state.isFocused
        ? "#f9f9f9"
        : "transparent",
      textAlign: "center",
    }),
  };
  const modalName = `deletereffood${food?.id}`;
  const error = {
    food: food?.food?.erro || false,
    unity: food?.unity?.erro || false,
  };
  return (
    <>
      <input
        type="number"
        value={quantity}
        onChange={(e) => handleQuantityChange(e)}
        className={`border-1 py-[2px] text-center rounded-lg  ${
          quantity === ""
            ? "bg-lightred border-darkred text-darkred"
            : "border-grey10"
        }`}
      />

      <Select
        options={unityOptions}
        value={selectedUnity}
        onChange={handleUnityChange}
        placeholder=""
        isDisabled={!selectedFood}
        // menuPortalTarget={document.querySelector("#editref")}
        // menuPosition="fixed"
        // menuPlacement="auto"
        styles={{
          ...selectStyle,
          control: (base, state) => ({
            ...base,
            transition: "200ms all ease",
            borderColor: error?.unity ? "#7B3232" : "#d1d1d1",
            backgroundColor: error?.unity ? "#FFEDED" : "white",
            color: error?.unity ? "#7B3232" : "inherit",
            borderRadius: "8px",
          }),
        }}
      />
      <Select
        options={foodOptions}
        value={selectedFood}
        placeholder="Selecionar Alimento"
        onChange={handleFoodChange}
        // menuPortalTarget={document.querySelector("#editref")}
        // menuPosition="fixed"
        // menuPlacement="auto"
        styles={{
          ...selectStyle,
          control: (base, state) => ({
            ...base,
            borderColor: error?.food ? "#7B3232" : "#d1d1d1",
            backgroundColor: error?.food ? "#FFEDED" : "white",
            color: error?.food ? "#7B3232" : "inherit",
            borderRadius: "8px",
          }),
        }}
        noOptionsMessage={() => "Nenhum alimento encontrado"}
      />

      <Menus.Menu>
        <Menus.Toggle
          id={`editreffood${food?.id}`}
          className="rounded-lg items-center"
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={`editreffood${food?.id}`}>
          <Menus.Button icon={<HiOutlineDuplicate />} onClick={duplicateFood}>
            Duplicar alimento
          </Menus.Button>
          <Modal.Open opens={modalName}>
            <Menus.Button icon={<HiOutlineTrash />}>
              Apagar alimento
            </Menus.Button>
          </Modal.Open>
        </Menus.List>
      </Menus.Menu>
      <Modal.Window name={modalName}>
        <ConfirmDelete
          resource="Alimento"
          resourceName={food.food.name}
          onConfirm={() => onDeleteFood(mealId, food?.id)}
          modalName={modalName}
        />
      </Modal.Window>
    </>
  );
}
