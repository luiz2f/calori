import RefEditVarRow from "./RefEditVarRow";

export default function EditRefList({
  mealsList,
  onDeleteVariation,
  onSelectVariation,
  handleAddVariation,
}) {
  return (
    <>
      <div className="text-grey50 text-sm mb-1 pl-2">Variações</div>
      <div className="flex flex-col mb-3">
        {mealsList?.map((mealvar, index) => (
          <RefEditVarRow
            key={index}
            index={index}
            refvar={mealvar}
            onSelectVariation={onSelectVariation}
            onDelete={onDeleteVariation}
          />
        ))}
      </div>
      <button
        onClick={(e) => handleAddVariation(e)}
        className={`text-blacklight pl-2 mb-6 ${
          !mealsList.length
            ? "cursor-pointer text-xl text-center pl-2 mt-1 underline  underline-offset-4 text-darkgreen"
            : ""
        }`}
      >
        {!mealsList.length
          ? "+ Adicionar Variação de Refeição"
          : "+ Adicionar Nova"}
      </button>
    </>
  );
}
