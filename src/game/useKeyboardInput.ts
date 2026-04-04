import { useEffect, useRef } from "react";
import { Platform, TextInput } from "react-native";
import { useGameStore } from "./gameStore";

/**
 * Wires up keyboard input to the game store.
 * - Web: listens to document keydown events
 * - Native: returns a ref to attach to a hidden TextInput
 *
 * Keys: 1–9 → enterNumber, Backspace/Delete/0 → eraseCell
 */
export function useKeyboardInput() {
  const { enterNumber, eraseCell, selectedCell, status } = useGameStore();
  const inputRef = useRef<TextInput>(null);

  // Keep the hidden TextInput focused whenever a cell is selected (native only)
  useEffect(() => {
    if (Platform.OS !== "web" && selectedCell && status === "playing") {
      inputRef.current?.focus();
    }
  }, [selectedCell, status]);

  // Web: direct document keydown listener
  useEffect(() => {
    if (Platform.OS !== "web") return;

    function onKeyDown(e: KeyboardEvent) {
      if (status !== "playing" || !selectedCell) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) {
        e.preventDefault();
        enterNumber(n);
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        e.preventDefault();
        eraseCell();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [status, selectedCell, enterNumber, eraseCell]);

  // Native: handler for the hidden TextInput's onKeyPress
  function onNativeKeyPress(key: string) {
    if (status !== "playing" || !selectedCell) return;
    const n = parseInt(key, 10);
    if (n >= 1 && n <= 9) {
      enterNumber(n);
    } else if (key === "Backspace") {
      eraseCell();
    }
  }

  return { inputRef, onNativeKeyPress };
}
