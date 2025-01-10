import SuccessPage from "@/components/by-page/auth/SucessPage";
import NavAnchor from "@/components/ui/NavAnchor";

export default function TokenSent() {
  const subtitle = (
    <>
      Verifique seu <strong></strong>e-mail e siga os passos
      <br />
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
