"use client";

import { useMemo, useState } from "react";
import { Building2, Plus, UsersRound } from "lucide-react";

import { departmentsData, type Department } from "@/data/departments";
import { users } from "@/data/users";

import DepartmentToolbar from "./DepartmentToolbar";
import DepartmentTable from "./DepartmentTable";
import DepartmentCardList from "./DepartmentCardList";
import DepartmentFormModal from "./DepartmentFormModal";

const emptyDepartment: Omit<Department, "id" | "createdAt"> = {
  name: "",
  code: "",
  description: "",
};

export default function DepartmentPageContent() {
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const filteredDepartments = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(normalizedSearch) ||
        department.code.toLowerCase().includes(normalizedSearch) ||
        department.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [departments, searchValue]);

  const totalUserCount = users.length;

  const handleCreateClick = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (departmentId: string) => {
    setDepartments((currentDepartments) =>
      currentDepartments.filter((department) => department.id !== departmentId)
    );
  };

  const handleSubmit = (formData: Omit<Department, "id" | "createdAt">) => {
    if (editingDepartment) {
      setDepartments((currentDepartments) =>
        currentDepartments.map((department) =>
          department.id === editingDepartment.id
            ? {
                ...department,
                ...formData,
              }
            : department
        )
      );

      setEditingDepartment(null);
      setIsModalOpen(false);
      return;
    }

    const newDepartment: Department = {
      ...formData,
      id: `dep-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setDepartments((currentDepartments) => [
      newDepartment,
      ...currentDepartments,
    ]);

    setIsModalOpen(false);
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <MetaCard
          icon={<Building2 className="h-4 w-4" />}
          label="Toplam Departman"
          value={departments.length}
          description="Kayıtlı organizasyon birimi"
        />

        <MetaCard
          icon={<UsersRound className="h-4 w-4" />}
          label="Toplam Kişi Sayısı"
          value={totalUserCount}
          description="Sisteme kayıtlı kullanıcı"
        />

        <button
          type="button"
          onClick={handleCreateClick}
          className="group rounded-[1.5rem] border border-neutral-200 bg-neutral-950 p-4 text-left text-white shadow-sm transition hover:bg-neutral-800 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Oluştur
              </p>

              <h2 className="mt-2 text-base font-semibold">
                Yeni Departman
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-300">
                Yeni bir departman tanımla.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-950 transition group-hover:scale-105">
              <Plus className="h-5 w-5" />
            </div>
          </div>
        </button>
      </section>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <DepartmentToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <div className="mt-6">
          <div className="hidden lg:block">
            <DepartmentTable
              departments={filteredDepartments}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>

          <div className="lg:hidden">
            <DepartmentCardList
              departments={filteredDepartments}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </section>

      <DepartmentFormModal
        isOpen={isModalOpen}
        initialData={editingDepartment ?? emptyDepartment}
        isEditing={Boolean(editingDepartment)}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}

type MetaCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
};

function MetaCard({ icon, label, value, description }: MetaCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
          {icon}
        </div>
      </div>
    </div>
  );
}