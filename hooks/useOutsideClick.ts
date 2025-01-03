"use client";
import { useEffect, useRef, useContext } from "react";
import { ModalContext } from "@/components/ui/Modal";

export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  mounted: boolean = true,
  name: string
) {
  const ref = useRef<T | null>(null);
  const { openNames } = useContext(ModalContext);
  // Criar um contexto e observer se é o último mounted, se sim, tem listerner, se não não tem uqe der listener nenhum
  const isLast = openNames[openNames.length - 1] === name;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!mounted || !isLast) return; // Cancel the handler if the component is not mounted
      const target = e.target as Element;
      const menu = document?.getElementById("menu-container");
      // const lastOpenName = openNames[openNames.length - 1];
      const isSelectMenu = target.role === "option";
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !(menu && menu.contains(target)) &&
        !isSelectMenu
        // (!ref.current.dataset.name ||
        //   lastOpenName === ref.current?.dataset.name)
      ) {
        console.log("🐥 Outsideclick", name);
        handler();
      }
    }

    if (mounted) {
      document?.addEventListener("click", handleClick);
    }
    return () => {
      document?.removeEventListener("click", handleClick);
    };
  }, [handler, openNames]);
  return ref;
}
