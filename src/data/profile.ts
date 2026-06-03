export type TodoStatus = "not-started" | "active" | "completed";

export type TodoItem = {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  date: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  identityNumber: string;
  email: string;
  phone: string;
  department: string;
  role: string;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dayAmount: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayAmount);

  return formatDateKey(date);
}

export const userProfile: UserProfile = {
  firstName: "Mert",
  lastName: "Arar",
  identityNumber: "12345678901",
  email: "mertarar.ma@gmail.com",
  phone: "+90 555 555 55 55",
  department: "Yazılım",
  role: "Yönetici",
};

export const todos: TodoItem[] = [
  {
    id: 1,
    title: "CRM kullanıcı rolleri",
    description: "Kullanıcı yetki seviyeleri ve rol yapısı planlanacak.",
    status: "not-started",
    date: addDays(0),
  },
  {
    id: 2,
    title: "Müşteri listesi düzeni",
    description: "Tablo filtreleme ve arama alanı tasarlanacak.",
    status: "not-started",
    date: addDays(2),
  },
  {
    id: 3,
    title: "Departman yetkileri",
    description: "Departmana göre görünür alanlar belirlenecek.",
    status: "not-started",
    date: addDays(5),
  },
  {
    id: 4,
    title: "Yeni müşteri araması",
    description: "Potansiyel müşteri ile ilk görüşme yapılacak.",
    status: "active",
    date: addDays(0),
  },
  {
    id: 5,
    title: "Teklif takip ekranı",
    description: "Teklif durumları için taslak arayüz hazırlanacak.",
    status: "active",
    date: addDays(1),
  },
  {
    id: 6,
    title: "ABC Mobilya teklif kontrolü",
    description: "Revize teklif dosyası kontrol edilecek.",
    status: "completed",
    date: addDays(-1),
  },
  {
    id: 7,
    title: "Tamamlanan görev raporu",
    description: "Haftalık tamamlanan işler raporlanacak.",
    status: "completed",
    date: addDays(-3),
  },
];