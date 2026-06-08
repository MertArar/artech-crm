import type { DepartmentName } from "@/data/departments";

export type UserRole =
  | "Yönetici"
  | "Satış Temsilcisi"
  | "Operasyon"
  | "Muhasebe"
  | "Mali Müslavir"
  | "Destek";

export type UserItem = {
  id: number;
  image?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identityNumber: string;
  role: UserRole;
  department: DepartmentName;
};

export const users: UserItem[] = [
  {
    id: 1,
    firstName: "Özge",
    lastName: "Eryıldız",
    email: "ozge@artech.com",
    phone: "+90 555 111 22 33",
    identityNumber: "12345678901",
    role: "Yönetici",
    department: "Yazılım",
  },
  {
    id: 2,
    firstName: "Mert",
    lastName: "Arar",
    email: "mert@artech.com",
    phone: "+90 555 222 33 44",
    identityNumber: "23456789012",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 3,
    firstName: "Selim",
    lastName: "Eryıldız",
    email: "selim@artech.com",
    phone: "+90 555 333 44 55",
    identityNumber: "34567890123",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 4,
    firstName: "Doğan",
    lastName: "Arar",
    email: "dogan@artech.com",
    phone: "+90 555 444 55 66",
    identityNumber: "45678901234",
    role: "Mali Müslavir",
    department: "Finans",
  },
  {
    id: 5,
    firstName: "Mustafa",
    lastName: "Çardak",
    email: "mustafa@artech.com",
    phone: "+90 555 555 66 77",
    identityNumber: "56789012345",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 6,
    firstName: "Batuhan",
    lastName: "Uysal",
    email: "batuhan@artech.com",
    phone: "+90 555 666 77 88",
    identityNumber: "67890123456",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 7,
    firstName: "Semih",
    lastName: "Hatipoğlu",
    email: "semih@artech.com",
    phone: "+90 555 777 88 99",
    identityNumber: "78901234567",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 8,
    firstName: "İrfan Ülgen",
    lastName: "Küçükbezirci",
    email: "irfan@artech.com",
    phone: "+90 555 888 99 00",
    identityNumber: "89012345678",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 9,
    firstName: "Mustafa Emre",
    lastName: "Çakır",
    email: "mustafaemre@artech.com",
    phone: "+90 555 999 00 11",
    identityNumber: "90123456789",
    role: "Muhasebe",
    department: "Finans",
  },
  {
    id: 10,
    firstName: "Emre",
    lastName: "Özkan",
    email: "emre@artech.com",
    phone: "+90 555 101 20 30",
    identityNumber: "11223344556",
    role: "Yönetici",
    department: "Yönetim",
  },
  {
    id: 11,
    firstName: "Halil İbrahim",
    lastName: "Tüzün",
    email: "halilibrahim@artech.com",
    phone: "+90 555 202 30 40",
    identityNumber: "22334455667",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 12,
    firstName: "Ahmet",
    lastName: "Yurtçu",
    email: "ahmet@artech.com",
    phone: "+90 555 303 40 50",
    identityNumber: "33445566778",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 13,
    firstName: "Sencer",
    lastName: "Uşaklı",
    email: "sencer@artech.com",
    phone: "+90 555 404 50 60",
    identityNumber: "44556677889",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 14,
    firstName: "Hasan",
    lastName: "Şahin",
    email: "hasan@artech.com",
    phone: "+90 555 505 60 70",
    identityNumber: "55667788990",
    role: "Muhasebe",
    department: "Finans",
  },
  {
    id: 15,
    firstName: "Mehmet Can",
    lastName: "Kaya",
    email: "mehmetcan@artech.com",
    phone: "+90 555 606 70 80",
    identityNumber: "66778899001",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 16,
    firstName: "Kerem",
    lastName: "Yıldırım",
    email: "kerem@artech.com",
    phone: "+90 555 707 80 90",
    identityNumber: "77889900112",
    role: "Yönetici",
    department: "Yazılım",
  },
  {
    id: 17,
    firstName: "Recep",
    lastName: "Nuruduk",
    email: "recep@artech.com",
    phone: "+90 555 808 90 10",
    identityNumber: "88990011223",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 18,
    firstName: "Muzaffer",
    lastName: "Ferahkaya",
    email: "mu.ferahkaya@sempaponpa.com",
    phone: "+90 505 183 24 34",
    identityNumber: "12389654446",
    role: "Yönetici",
    department: "Yönetim",
  },
  
];