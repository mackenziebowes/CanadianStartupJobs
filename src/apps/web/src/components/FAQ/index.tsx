"use client";
import { useState } from "react";
import FAQButton from "./FAQButton";
import FAQModal from "./FAQModal";

export default function FAQ() {
  const [isOpen, set_isOpen] = useState(false);
  const open = () => set_isOpen(true);
  const close = () => set_isOpen(false);

  return (
    <>
      <FAQButton open={open} />
      <FAQModal isOpen={isOpen} onClose={close} />
    </>
  )
}
