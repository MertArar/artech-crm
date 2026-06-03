import type { ChatMessage } from "@/data/chat";

export const documentAccept =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv";

export const mediaAccept = "image/*,video/*";

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatTime(dateValue: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageFile(fileName?: string) {
  if (!fileName) return false;

  return /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(fileName);
}

export function isVideoFile(fileName?: string) {
  if (!fileName) return false;

  return /\.(mp4|webm|mov|avi|mkv)$/i.test(fileName);
}

export function getMessagePreview(message: ChatMessage) {
  if (message.type === "file") {
    return message.fileName ? `Belge: ${message.fileName}` : "Belge gönderildi";
  }

  if (message.type === "media") {
    return message.fileName
      ? `Medya: ${message.fileName}`
      : "Fotoğraf / video gönderildi";
  }

  if (message.type === "audio") {
    return "Ses kaydı";
  }

  return message.content;
}