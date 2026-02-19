"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: { borderRadius: "14px" },
      }}
    />
  );
}
