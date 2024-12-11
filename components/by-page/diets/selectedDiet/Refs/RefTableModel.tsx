import { createContext, useContext, ReactNode } from "react";
import RefSlider from "./RefSlider";

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
      <div role="table" className="flex flex-col w-full p-2 ">
        {children}
      </div>
      <RefSlider />
    </TableContext.Provider>
  );
}

function Header({
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
    throw new Error("Header must be used within a Table");
  }

  return (
    <div
      role="row"
      style={{ gridTemplateColumns: context.columns }}
      className="grid mt-2 flex border-b-1 border-darkgreen  pr-1  text-darkgreen"
    >
      <div className="text-left align-bottom text-xl font-normal self-end">
        {name}
      </div>
      <div className="text-center font-normal align-bottom ">
        <div className="grayscale contrast-150 text-xs opacity-50">🍞</div>
        <div className="">{carbo}</div>
      </div>
      <div className="text-center font-normal align-bottom ">
        <div className="grayscale contrast-150 text-xs opacity-50">🥩</div>
        <div className="">{prot}</div>
      </div>
      <div className="text-center font-normal align-bottom ">
        <div className="grayscale contrast-150 text-xs opacity-50">🥑</div>
        <div className="">{fat}</div>
      </div>
      <div className="text-right font-normal align-bottom">
        <div className="text-xs text-grey50">kcal</div>
        <div className="">{kcal}</div>
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

  return (
    <div
      role="row"
      style={{ gridTemplateColumns: context.columns }}
      className="grid border-b-1 border-greylight text-sm pr-1  [&>div]:py-1 [&>div]:text-center [&>div]:text-blacklight last:text-right last:border-b-0"
    >
      <div role="cell" className="pl-2 !text-left !text-black  ">
        {name}
      </div>
      {/* MUITO PERTO DA BORDA DA DIREITA */}
      {/* SLIDER */}
      <div role="cell ">{carbo}</div>
      <div role="cell">{prot}</div>
      <div role="cell">{fat}</div>
      <div role="cell" className="!text-right ">
        {kcal}
      </div>
    </div>
  );
}

function Body<T>({
  data,
  render,
}: {
  data: T[];
  render: (item: T, index: number) => ReactNode;
}) {
  return (
    <div role="rowgroup" className="bg-ulgrey">
      {data.map(render)}
    </div>
  );
}

// 📌 SLIDER
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

// Exportando subcomponentes para serem usados como Table.Header, Table.Row etc.
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;
