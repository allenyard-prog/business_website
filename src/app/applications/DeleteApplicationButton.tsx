"use client";

import { useEffect, useRef, useState } from "react";
import { deleteApplication } from "./actions";

export default function DeleteApplicationButton({ id, applicantName }: { id: string; applicantName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button className="application-delete-trigger" type="button" onClick={() => setIsOpen(true)}>Remove</button>
      {isOpen && (
        <div className="application-delete-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div className="application-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`delete-title-${id}`} aria-describedby={`delete-description-${id}`}>
            <span className="application-delete-icon" aria-hidden="true">!</span>
            <p>Remove application</p>
            <h3 id={`delete-title-${id}`}>Remove {applicantName}?</h3>
            <p id={`delete-description-${id}`}>This permanently deletes the application and all submitted contact information. This action cannot be undone.</p>
            <div className="application-delete-actions">
              <button ref={cancelButtonRef} type="button" onClick={() => setIsOpen(false)}>Cancel</button>
              <form action={deleteApplication}>
                <input type="hidden" name="id" value={id} />
                <button type="submit">Yes, remove application</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
