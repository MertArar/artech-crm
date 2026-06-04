import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";

const faqItems = [
  {
    question: "CRM nedir?",
    answer:
      "CRM, müşteri ilişkilerini yönetmek için kullanılan bir sistemdir. Müşteri bilgileri, görüşmeler, teklifler, satış fırsatları, görevler ve takip süreçleri tek bir panel üzerinden düzenli şekilde yönetilir.",
  },
  {
    question: "CRM ne işe yarar?",
    answer:
      "CRM sayesinde müşteriyle yapılan tüm temaslar kayıt altında tutulur. Satış ekibi kiminle ne konuştuğunu, hangi teklifin gönderildiğini, hangi görevin beklediğini ve hangi müşterinin takip edilmesi gerektiğini kolayca görebilir.",
  },
  {
    question: "CRM sadece satış için mi kullanılır?",
    answer:
      "Hayır. CRM satış dışında müşteri destek, operasyon, finans ve yönetim süreçlerinde de kullanılabilir. Örneğin destek ekibi müşteri taleplerini takip ederken, yönetim ekibi genel performansı ve ekip görevlerini izleyebilir.",
  },
  {
    question: "Kullanıcı rolleri ne işe yarar?",
    answer:
      "Roller, kullanıcıların sistemde hangi sayfalara erişebileceğini ve hangi işlemleri yapabileceğini belirler. Örneğin bir satış temsilcisi teklifleri görebilirken, sistem ayarlarına erişemeyebilir.",
  },
  {
    question: "Departman ve rol arasındaki fark nedir?",
    answer:
      "Departman kullanıcının şirkette hangi birimde çalıştığını ifade eder. Rol ise sistem içindeki yetki grubudur. Örneğin Finans departmanındaki Müdür ile Satış departmanındaki Müdür aynı isimde olabilir, ancak yetkileri farklı olabilir.",
  },
  {
    question: "CRM sistemi şirket içinde neyi kolaylaştırır?",
    answer:
      "CRM sistemi iş takibini, müşteri geçmişini, teklif yönetimini ve ekip içi koordinasyonu kolaylaştırır. Dağınık Excel dosyaları, WhatsApp mesajları ve unutulan görevler yerine merkezi bir yapı sunar.",
  },
];

const featureCards = [
  {
    title: "Müşteri Yönetimi",
    description: "Müşteri bilgileri, iletişim geçmişi ve notlar tek yerde toplanır.",
    icon: Users,
  },
  {
    title: "Satış Takibi",
    description: "Teklifler, fırsatlar ve satış süreçleri daha düzenli izlenir.",
    icon: Workflow,
  },
  {
    title: "Yetki Kontrolü",
    description: "Departman ve role göre kullanıcı erişimleri sınırlandırılır.",
    icon: ShieldCheck,
  },
  {
    title: "Ekip Koordinasyonu",
    description: "Görevler, mesajlar ve süreçler ekip içinde daha görünür olur.",
    icon: MessageSquareText,
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Programa geri dön
          </Link>

          <div className="hidden items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 shadow-sm sm:flex">
            <CircleHelp className="h-4 w-4" />
            Yardım Merkezi
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <div className="relative border-b border-neutral-100 p-6 sm:p-8 lg:p-10">
            <div className="absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-neutral-100 lg:block" />

            <div className="relative max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                <Layers3 className="h-4 w-4" />
                CRM Bilgilendirme
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
                Sıkça Sorulan Sorular
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                Bu bölüm, CRM sisteminin ne olduğunu, hangi amaçlarla
                kullanıldığını ve şirket içindeki rol, departman ve yetki
                yapısının nasıl çalıştığını açıklamak için hazırlanmıştır.
              </p>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="mt-4 text-sm font-semibold text-neutral-950">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-neutral-950">
              CRM neden önemlidir?
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Büyüyen şirketlerde müşteri bilgileri, teklifler, görevler ve
              satış süreçleri zamanla dağınık hale gelebilir. CRM sistemi bu
              dağınıklığı azaltır, ekiplerin aynı bilgiye ulaşmasını sağlar ve
              iş takibini daha kontrollü hale getirir.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Müşteri geçmişi kaybolmaz.",
                "Satış süreci daha net takip edilir.",
                "Departmanlar arası bilgi akışı güçlenir.",
                "Yetki yapısı daha güvenli hale gelir.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950" />
                  <p className="text-sm leading-6 text-neutral-600">{item}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-bold text-neutral-700">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-neutral-950">
                      {item.question}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Programa geri dönmeye hazır mısın?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
                CRM paneline dönerek müşterileri, rolleri, departmanları,
                teklifleri ve görevleri yönetmeye devam edebilirsin.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Programa geri dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}