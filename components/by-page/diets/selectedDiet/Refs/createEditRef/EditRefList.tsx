import RefEditVarRow from "./RefEditVarRow";

export default function EditRefList({ refvars }) {
  return (
    <>
      <label className="text-grey50 text-sm mb-1 pl-2">Variações</label>
      <div className="flex flex-col  mb-3">
        {refvars?.map((refvar, index) => {
          return <RefEditVarRow key={index} refvar={refvar} />;
        })}
      </div>
      <button className="text-blacklight pl-2 mb-6">+ Adicionar Nova</button>
    </>
  );
}
