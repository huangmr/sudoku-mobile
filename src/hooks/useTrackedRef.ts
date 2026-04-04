import { useEffect, useRef } from "react";

type Callback = () => void;

export const useTrackedRef = (callback: Callback) => {
  const ref = useRef<Callback>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return ref;
};
