export type NotificationType = "task" | "user" | "system" | "message";

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  isUnread: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Yeni görev atandı",
    description: "CRM kullanıcı rolleri görevi size atandı.",
    time: "5 dk önce",
    type: "task",
    isUnread: true,
  },
  {
    id: 2,
    title: "Yeni kullanıcı eklendi",
    description: "Ahmet Yılmaz sisteme kullanıcı olarak eklendi.",
    time: "18 dk önce",
    type: "user",
    isUnread: true,
  },
  {
    id: 3,
    title: "Teklif güncellendi",
    description: "ABC Mobilya teklif dosyasında güncelleme yapıldı.",
    time: "1 saat önce",
    type: "system",
    isUnread: false,
  },
  {
    id: 4,
    title: "Yeni mesaj",
    description: "Satış ekibinden yeni bir mesaj aldınız.",
    time: "2 saat önce",
    type: "message",
    isUnread: false,
  },
  {
    id: 5,
    title: "Görev tamamlandı",
    description: "Müşteri listesi düzeni görevi tamamlandı olarak işaretlendi.",
    time: "Dün",
    type: "task",
    isUnread: false,
  },
  {
    id: 6,
    title: "Sistem bildirimi",
    description: "Kullanıcı yetkileri başarıyla güncellendi.",
    time: "2 gün önce",
    type: "system",
    isUnread: false,
  },
];