"use client";

import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface ModalContextType {
  open: (name: string) => void;
  openNames: string[];
  close: (name: string) => void;
  closeLast: () => void;
}

interface ModalProps {
  children: React.ReactNode;
}

interface OpenProps {
  children: React.ReactElement<{ onClick: () => void }>;
  opens: string;
}
interface WindowProps {
  children: React.ReactElement<ModalChildProps>;
  name: string;
}

type ModalChildProps = {
  onCloseModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  open: () => {},
  openNames: [],
  close: () => {},
});

function Modal({ children }: ModalProps) {
  const [openNames, setOpenNames] = useState<string[]>([]);
  // console.log(openNames);
  // console.log(openNames);
  const open = (name: string) => setOpenNames((prev) => [...prev, name]);
  const close = (name: string) => {
    // console.log("🐇 fechando especifico");
    // console.log(name, openNames);
    setOpenNames((prev) => prev.filter((openName) => openName !== name));
  };
  const closeLast = () => {
    // console.log("🐢 fechando ultimo");
    setOpenNames((prev) => prev.slice(0, prev.length - 1));
  }; // Fecha o modal mais recente

  // useEffect(() => {
  //   console.log(`Modal mounted: ${name}`);
  //   return () => {
  //     console.log(`Modal unmounted: ${name}`);
  //   };
  // });

  return (
    <ModalContext.Provider value={{ open, close, closeLast, openNames }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens }: OpenProps) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: (e) => {
      e?.stopPropagation();
      e?.preventDefault();
      open(opens);
      if (children.props.onClick) {
        children.props.onClick(e); // Chama a função onClick original se existir
      }
    },
  });
}

function Window({ children, name }: WindowProps) {
  const { openNames, close, closeLast } = useContext(ModalContext);
  const mounted = openNames.includes(name) && React.isValidElement(children);
  const ref = useOutsideClick<HTMLDivElement>(closeLast, mounted, name);

  // useEffect(() => {
  //   console.log(`Window mounted: ${name}`);
  //   return () => {
  //     console.log(`Window unmounted: ${name}`);
  //   };
  // });

  if (!openNames.includes(name)) return null;

  if (!React.isValidElement(children)) {
    console.error("`children` must be a valid React element");
    return null;
  }

  const zIndex = openNames.indexOf(name) + 2000;
  const message = "window" + name;
  return createPortal(
    <div
      style={{ zIndex: zIndex }}
      className="fixed top-0 left-0 w-full h-screen"
    >
      <div
        className={`fixed inset-0 bg-black ${
          zIndex === 2000 ? "bg-opacity-50" : "bg-opacity-25"
        }`}
      />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 p-4 w-11/12 bg-white rounded-lg"
        data-name={name}
        ref={ref}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            close(name);
          }}
          className="absolute top-3 right-4 p-2 translate-x-2 bg-none border-none hover:bg-gray-100 rounded-sm z-50"
        >
          <HiXMark className="w-4 h-4 text-gray-500" />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
