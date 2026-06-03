export type UserRole =
  | "Yönetici"
  | "Satış Temsilcisi"
  | "Operasyon"
  | "Muhasebe"
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
  department: string;
};

export const users: UserItem[] = [
  {
    id: 1,
    firstName: "Mert",
    lastName: "Arar",
    email: "mert@artech.com",
    phone: "+90 555 111 22 33",
    identityNumber: "12345678901",
    role: "Yönetici",
    department: "Yazılım",
  },
  {
    id: 2,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet@artech.com",
    phone: "+90 555 222 33 44",
    identityNumber: "23456789012",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 3,
    firstName: "Zeynep",
    lastName: "Kara",
    email: "zeynep@artech.com",
    phone: "+90 555 333 44 55",
    identityNumber: "34567890123",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 4,
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet@artech.com",
    phone: "+90 555 444 55 66",
    identityNumber: "45678901234",
    role: "Muhasebe",
    department: "Finans",
  },
  {
    id: 5,
    firstName: "Elif",
    lastName: "Şahin",
    email: "elif@artech.com",
    phone: "+90 555 555 66 77",
    identityNumber: "56789012345",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 6,
    firstName: "Burak",
    lastName: "Aydın",
    email: "burak@artech.com",
    phone: "+90 555 666 77 88",
    identityNumber: "67890123456",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 7,
    firstName: "İrem",
    lastName: "Koç",
    email: "irem@artech.com",
    phone: "+90 555 777 88 99",
    identityNumber: "78901234567",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 8,
    firstName: "Can",
    lastName: "Öztürk",
    email: "can@artech.com",
    phone: "+90 555 888 99 00",
    identityNumber: "89012345678",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 9,
    firstName: "Derya",
    lastName: "Çelik",
    email: "derya@artech.com",
    phone: "+90 555 999 00 11",
    identityNumber: "90123456789",
    role: "Muhasebe",
    department: "Finans",
  },
  {
    id: 10,
    firstName: "Kaan",
    lastName: "Aslan",
    email: "kaan@artech.com",
    phone: "+90 555 101 20 30",
    identityNumber: "11223344556",
    role: "Yönetici",
    department: "Yönetim",
  },
  {
    id: 11,
    firstName: "Seda",
    lastName: "Güneş",
    email: "seda@artech.com",
    phone: "+90 555 202 30 40",
    identityNumber: "22334455667",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 12,
    firstName: "Emre",
    lastName: "Polat",
    email: "emre@artech.com",
    phone: "+90 555 303 40 50",
    identityNumber: "33445566778",
    role: "Operasyon",
    department: "Operasyon",
  },
  {
    id: 13,
    firstName: "Buse",
    lastName: "Aksoy",
    email: "buse@artech.com",
    phone: "+90 555 404 50 60",
    identityNumber: "44556677889",
    role: "Destek",
    department: "Müşteri Destek",
  },
  {
    id: 14,
    firstName: "Onur",
    lastName: "Yalçın",
    email: "onur@artech.com",
    phone: "+90 555 505 60 70",
    identityNumber: "55667788990",
    role: "Muhasebe",
    department: "Finans",
  },
  {
    id: 15,
    firstName: "Melis",
    lastName: "Erdoğan",
    email: "melis@artech.com",
    phone: "+90 555 606 70 80",
    identityNumber: "66778899001",
    role: "Satış Temsilcisi",
    department: "Satış",
  },
  {
    id: 16,
    firstName: "Kerem",
    lastName: "Bulut",
    email: "kerem@artech.com",
    phone: "+90 555 707 80 90",
    identityNumber: "77889900112",
    role: "Yönetici",
    department: "Yazılım",
  },
  {
    id: 17,
    firstName: "Naz",
    lastName: "Arslan",
    email: "naz@artech.com",
    phone: "+90 555 808 90 10",
    identityNumber: "88990011223",
    role: "Destek",
    department: "Müşteri Destek",
  },
];