"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";

type Position = {
  x: number;
  y: number;
};

type MenusContextType = {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: Position | null;
  setPosition: (position: Position) => void;
};

type MenusProps = {
  children: ReactNode;
  className?: string;
};

type ToggleProps = {
  children: ReactNode;
  className?: string;
  id: string;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState<string>("");
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId("");
  const open = (id: string) => setOpenId(id);

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Menu({ children, className }: MenusProps) {
  return (
    <div className={`flex items-baseline ${className ? className : ""}`}>
      {children}
    </div>
  );
}

function Toggle({ id, children, className }: ToggleProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Toggle must be used within a Menus component");

  const { openId, close, open, setPosition } = context;
  // talvez um settimout pro mousedown/ touch start

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (openId === id) {
      close();
      return;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      // se posição menor que tamanho, usar 0
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
      open(id);
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

type ListProps = {
  id: string;
  children: ReactNode;
};

function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("List must be used within a Menus component");

  const { openId, position, close } = context;
  const ref = useOutsideClick(close, false);

  if (openId !== id || !position) return null;

  return createPortal(
    <ul
      id="menu-container"
      ref={ref}
      className="fixed bg-white shadow-md rounded-md z-[5000]"
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </ul>,
    document.body
  );
}

type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
};

function Button({ children, icon, onClick }: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Button must be used within a Menus component");

  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className="w-full text-left bg-transparent border-none px-4 py-2 text-sm flex justify-between items-center gap-4 hover:bg-gray-50"
      >
        <span>{children}</span>
        {icon}
      </button>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
