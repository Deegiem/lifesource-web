import React from "react";

export function SearchInput({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input placeholder={placeholder ?? "Search..."} value={value} onChange={onChange} className="bg-ca-card border border-ca-border rounded-md px-3 py-[7px] text-ca-text text-[12.5px] outline-none focus:border-ca-accent w-[200px]" />
  );
}
