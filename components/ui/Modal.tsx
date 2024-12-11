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
  openName: string;
  close: () => void;
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

const ModalContext = createContext<ModalContextType>({
  open: () => {},
  openName: "",
  close: () => {},
});

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ open, openName, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens }: OpenProps) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opens) });
}

function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  if (!React.isValidElement(children)) {
    console.error("`children` must be a valid React element");
    return null;
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen z-[1000]">
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8"
        ref={ref}
      >
        <button
          onClick={close}
          className="absolute top-3 right-4 p-1 translate-x-2 bg-none border-none hover:bg-gray-100 rounded-sm"
        >
          <HiXMark className="w-6 h-6 text-gray-500" />
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
