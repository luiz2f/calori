"use client";
import { createContext, useContext, ReactNode } from "react";

const TableContext = createContext<{ columns: string } | undefined>(undefined);

export default function Table({
  columns,
  children,
}: {
  columns: string;
  children: ReactNode;
}) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div role="table" className="flex flex-col w-full p-2">
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({
  name,
  carbo,
  prot,
  fat,
  kcal,
  onClick,
}: {
  name: string;
  carbo: number;
  prot: number;
  fat: number;
  kcal: number;
  onClick?: () => void;
}) {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Header must be used within a Table");
  }

  const opacity =
    carbo + prot + fat === 0
      ? "opacity-30 transition duration-200"
      : " transition duration-200";

  const colStyle = `text-center font-normal align-bottom ${opacity}`;

  function handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!onClick) return;
    onClick();
  }
  return (
    <div
      role="row"
      style={{ gridTemplateColumns: context.columns }}
      className="grid mt-4 pr-1 text-darkgreen"
    >
      <div
        className={`text-left align-bottom text-xl font-normal self-end ${
          onClick ? "cursor-pointer" : ""
        }`}
        onClick={(e) => handleClick(e)}
      >
        {name}
      </div>
      <div className={colStyle}>
        <div className="grayscale contrast-150 text-xs ">🍞</div>
        <div>{carbo}</div>
      </div>
      <div className={colStyle}>
        <div className="grayscale contrast-150 text-xs opacity-50">🥩</div>
        <div>{prot}</div>
      </div>
      <div className={colStyle}>
        <div className="grayscale contrast-150 text-xs opacity-50">🥑</div>
        <div>{fat}</div>
      </div>
      <div className={`text-right font-normal align-bottom ${opacity}`}>
        <div className="text-xs text-grey50">kcal</div>
        <div>{kcal}</div>
      </div>
    </div>
  );
}

function Row({
  name,
  carbo,
  prot,
  fat,
  kcal,
}: {
  name: string;
  carbo: number;
  prot: number;
  fat: number;
  kcal: number;
}) {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Row must be used within a Table");
  }
  const opacity =
    carbo + prot + fat === 0
      ? "opacity-30 transition duration-200"
      : " transition duration-200";

  const cellStyle = `text-center font-normal align-bottom`;

  return (
    <div
      role="row"
      style={{ gridTemplateColumns: context.columns }}
      className="grid border-b-1 items-center border-white text-sm pr-1 [&>div]:py-1 [&>div]:text-center [&>div]:text-blacklight last:text-right last:border-b-0 odd:bg-neutralgreen"
    >
      <div role="cell" className="pl-2 !text-left !text-black">
        {name}
      </div>
      <div role="cell" className={opacity}>
        {carbo}
      </div>
      <div role="cell" className={opacity}>
        {prot}
      </div>
      <div role="cell" className={opacity}>
        {fat}
      </div>
      <div role="cell" className={`!text-right ${opacity}`}>
        {kcal}
      </div>
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <div role="rowgroup" className="border-y-1 border-grey5">
      {children}
    </div>
  );
}

function NoFood({ onClick }) {
  function handleClick(e) {
    e.stopPropagation();
    onClick();
  }

  return (
    <button
      onClick={(e) => handleClick(e)}
      role="contentinfo"
      className="pl-2 py-1 !text-left !text-black underline cursor-pointer"
    >
      + Adicionar alimentos
    </button>
  );
}

function Footer({ children }: { children?: ReactNode }) {
  return (
    <div
      role="contentinfo"
      className="bg-gray-100 p-4 text-center text-sm text-gray-500"
    >
      {children}
    </div>
  );
}

// Exportando subcomponentes
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;
Table.NoFood = NoFood;
