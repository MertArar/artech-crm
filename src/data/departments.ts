export const departmentNames = [
  "Yazılım",
  "Satış",
  "Operasyon",
  "Finans",
  "Müşteri Destek",
  "Yönetim",
] as const;

export type DepartmentName = (typeof departmentNames)[number];

export type Department = {
  id: string;
  name: DepartmentName;
  code: string;
  description: string;
  createdAt: string;
};

export const departmentsData: Department[] = [
  {
    id: "dep-software",
    name: "Yazılım",
    code: "YZL",
    description: "Web, CRM, ERP ve dijital ürün geliştirme süreçlerini yürütür.",
    createdAt: "2026-06-01",
  },
  {
    id: "dep-sales",
    name: "Satış",
    code: "SAT",
    description: "Müşteri ilişkileri, teklif ve satış süreçlerini yönetir.",
    createdAt: "2026-06-01",
  },
  {
    id: "dep-operation",
    name: "Operasyon",
    code: "OPR",
    description: "Proje takibi, teslimat ve operasyonel süreçlerden sorumludur.",
    createdAt: "2026-06-02",
  },
  {
    id: "dep-finance",
    name: "Finans",
    code: "FIN",
    description: "Gelir, gider, fatura ve muhasebe süreçlerini takip eder.",
    createdAt: "2026-06-02",
  },
  {
    id: "dep-support",
    name: "Müşteri Destek",
    code: "DST",
    description: "Müşteri talepleri, destek kayıtları ve çözüm süreçlerini yürütür.",
    createdAt: "2026-06-03",
  },
  {
    id: "dep-management",
    name: "Yönetim",
    code: "YNT",
    description: "Şirket yönetimi, karar süreçleri ve genel koordinasyondan sorumludur.",
    createdAt: "2026-06-03",
  },
];