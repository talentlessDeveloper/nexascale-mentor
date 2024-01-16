import { X } from "lucide-react";
import React, { useRef, type SetStateAction } from "react";
import Portal from "../shared/portal";
import { Button } from "../ui/button";

type ModalLayoutProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
};

const ModalLayout = ({
  openModal,
  setOpenModal,
  children,
}: ModalLayoutProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const pageClickedElement = e.target as Node;
    if (!modalRef.current?.contains(pageClickedElement)) {
      setOpenModal(false);
    }
  };

  if (!openModal) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={handlePageClick}
      >
        <Button className="absolute right-10 top-5 bg-primary-foreground hover:bg-primary-foreground/80">
          <X className="text-primary" onClick={() => setOpenModal(false)} />
        </Button>
        <div
          className="flex w-[95%] max-w-lg flex-col items-center justify-center gap-7 rounded-2xl bg-primary-foreground p-6"
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default ModalLayout;
