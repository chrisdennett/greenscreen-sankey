import { useEffect } from "react";

export function useKeyPress(targetKey, handler) {
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      handler();
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", upHandler);
    };

    // eslint-disable-next-line
  }, []); // Empty array ensures that effect is only run on mount and unmount
}
