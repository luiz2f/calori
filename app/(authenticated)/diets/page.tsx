import SuccessPage from "@/components/by-page/auth/SucessPage";
import NavAnchor from "@/components/ui/NavAnchor";

export default function DietPage() {
  const subtitle = (
    <>
      Verifique seu <strong>email</strong> e siga os passos <br />
      para continuar
    </>
  );

  return (
    <>
      <SuccessPage title="Token enviado" subtitle={subtitle}>
        <NavAnchor href="/login">Fazer Login</NavAnchor>
      </SuccessPage>
    </>
  );
}
