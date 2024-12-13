import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing: boolean = true
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const menu = document.getElementById("menu-container");

      if (
        ref.current &&
        !ref.current.contains(target) &&
        !(menu && menu.contains(target))
      ) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handler, listenCapturing]);

  return ref;
}
