import { DietProvider } from "../context/useDietContext";

export default function Layout({ children }) {
  return <DietProvider>{children}</DietProvider>;
}
