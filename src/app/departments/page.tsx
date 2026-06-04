import DepartmentPageContent from "@/components/departments/DepartmentPageContent";

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Departmanlar
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
          Departman Yönetimi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Şirket içindeki departmanları oluştur, düzenle ve rol yönetimi için
          temel organizasyon yapısını hazırla.
        </p>
      </div>

      <DepartmentPageContent />
    </div>
  );
}