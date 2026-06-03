"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UserRole } from "@/data/users";

type RoleFilter = "Tümü" | UserRole;

type RoleDropdownProps = {
  roles: RoleFilter[];
  selectedRole: RoleFilter;
  onChange: (role: RoleFilter) => void;
};

export default function RoleDropdown({
  roles,
  selectedRole,
  onChange,
}: RoleDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectRole = (role: RoleFilter) => {
    onChange(role);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-64">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-sm font-semibold transition ${
          isOpen
            ? "border-neutral-700 shadow-sm"
            : "border-neutral-200 hover:border-neutral-300"
        }`}
      >
        <span className="truncate text-neutral-950">{selectedRole}</span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
          {roles.map((role) => {
            const isSelected = role === selectedRole;

            return (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
                className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <span>{role}</span>

                {isSelected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type { RoleFilter };