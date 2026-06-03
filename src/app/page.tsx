export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
          Genel Bakış
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Müşteriler, teklifler, satış fırsatları ve görevlerin genel durumunu
          buradan takip edeceğiz.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Aktif Müşteri",
            value: "128",
            description: "Sistemde kayıtlı aktif müşteri",
          },
          {
            label: "Açık Teklif",
            value: "34",
            description: "Takip bekleyen teklif sayısı",
          },
          {
            label: "Yeni Lead",
            value: "18",
            description: "Bu hafta eklenen potansiyel müşteri",
          },
          {
            label: "Bekleyen Görev",
            value: "7",
            description: "Tamamlanması gereken görevler",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-neutral-500">
              {card.label}
            </p>

            <p className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
              {card.value}
            </p>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}