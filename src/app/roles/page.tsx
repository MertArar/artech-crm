import RolesPageContent from "@/components/roles/RolesPageContent";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Roller
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
          Rol Ayarları
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Departmana bağlı rollerin erişebileceği sidebar sayfalarını ve sayfa
          bazlı yetkileri yönetin.
        </p>
      </div>

      <RolesPageContent />
    </div>
  );
}