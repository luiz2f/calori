"use client";

export default function Toogle({ options, value, onChange, className }) {
  return (
    <div
      className={`flex font-sm margin-auto border-1  border-grey40 text-grey40 rounded-lg w-fit mx-auto ${className}`}
    >
      {options.map((option, index) => {
        return (
          <OptionButton
            fixedWidth={options.length > 2}
            key={index}
            option={option}
            onChange={() => onChange(option)}
            isSelected={option === value}
            value={value}
          />
        );
      })}
    </div>
  );
}

function OptionButton({ option, onChange, isSelected, value, fixedWidth }) {
  if (isSelected) {
    return (
      <SelectedToogle
        option={option}
        onChange={onChange}
        fixedWidth={fixedWidth}
      />
    );
  } else {
    return (
      <OptionToogle
        option={option}
        onChange={onChange}
        fixedWidth={fixedWidth}
      />
    );
  }
}

function OptionToogle({ option, onChange, fixedWidth }) {
  function handleClick(e) {
    e.stopPropagation();
    onChange(option);
  }
  return (
    <button
      onClick={(e) => {
        handleClick(e);
      }}
      className={`px-2 rounded-lg ${fixedWidth ? "w-16" : ""}`}
    >
      {option}
    </button>
  );
}

function SelectedToogle({ option, onChange, fixedWidth }) {
  function handleClick(e) {
    e.stopPropagation();
    onChange(option);
  }
  return (
    <div
      className={`text-transparent px-2 border-red-600 rounded-lg relative ${
        fixedWidth ? "w-16" : ""
      }`}
    >
      {option}
      <button
        onClick={(e) => {
          handleClick(e);
        }}
        className={`text-darkgreen border-1 border-lightgreen bg-whitegreen z-10 px-2 rounded-lg absolute top-[-1px] right-[-1px] left-[-1px] bottom-[-1px] `}
      >
        {option}
      </button>
    </div>
  );
}
