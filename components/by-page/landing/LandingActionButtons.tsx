import NavButton from "@/components/ui/NavButton";

export default function LandingActionButtons() {
  return (
    <div className="flex flex-col gap-2 px-6 mt-5 mb-6">
      <NavButton href="/register" type="light">
        Registre-se
      </NavButton>
      <NavButton href="/login">Fazer Login</NavButton>
    </div>
  );
}
