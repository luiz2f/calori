import Table from "./RefTableModel";

export default function RefTable() {
  const data = [
    {
      name: "400 ml - Leite desnatado	",
      carbo: 27,
      prot: 1,
      fat: 0,
      kcal: 105,
    },
    {
      name: "2 un - Banana prata	",
      carbo: 12,
      prot: 8,
      fat: 5,
      kcal: 103,
    },
    {
      name: "30 g - Farinha de aveia	",
      carbo: 1,
      prot: 6,
      fat: 5,
      kcal: 78,
    },
  ];

  return (
    <Table columns="1fr 32px 32px 32px 32px">
      <Table.Header
        name="Leite com Banana"
        carbo={58}
        prot={25}
        fat={8}
        kcal={419}
      />

      <Table.Body
        data={data}
        render={(item, index) => (
          <Table.Row
            name={item.name}
            carbo={item.carbo}
            prot={item.prot}
            fat={item.fat}
            kcal={item.kcal}
            key={index}
          ></Table.Row>
        )}
      />
    </Table>
  );
}
