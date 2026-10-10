import React, { useEffect } from "react";

export default function GameInstructions({ title, instructions, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-lg rounded-xl bg-white p-6 text-left shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-instructions-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="game-instructions-title" className="text-2xl font-bold text-gray-800">
            {title} Instructions
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close instructions"
          >
            &times;
          </button>
        </div>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-gray-700">
          {instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[var(--accent-green)] px-4 py-2 font-medium text-white hover:bg-green-700"
        >
          Got it
        </button>
      </section>
    </div>
  );
}
