import React, { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>("#portal");
    if (target) {
      ref.current = target;
      setMounted(true);
    }

    // Cleanup the portal when the component is unmounted
    return () => {
      ref.current = null;
      setMounted(false);
    };
  }, []);

  // Only render the portal if it is mounted and the target element exists
  return mounted && ref.current
    ? createPortal(<div className="">{children}</div>, ref.current)
    : null;
};

export default Portal;
