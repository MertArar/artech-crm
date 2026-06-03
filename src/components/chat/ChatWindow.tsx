"use client";

import {
  ArrowLeft,
  Check,
  CheckCheck,
  Download,
  FileText,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChatContact, ChatMessage, MessageStatus } from "@/data/chat";
import {
  formatTime,
  getInitials,
  isImageFile,
  isVideoFile,
} from "./chatUtils";

type ChatWindowProps = {
  contact: ChatContact;
  messages: ChatMessage[];
  onBackMobile: () => void;
  onDeleteChat: () => void;
};

type ImagePreview = {
  src: string;
  fileName: string;
};

function MessageStatusIcon({ status }: { status?: MessageStatus }) {
  if (!status) {
    return null;
  }

  if (status === "sent") {
    return <Check className="h-4 w-4 text-white/50" />;
  }

  return (
    <CheckCheck
      className={`h-4 w-4 ${
        status === "read" ? "text-sky-400" : "text-white/50"
      }`}
    />
  );
}

export default function ChatWindow({
  contact,
  messages,
  onBackMobile,
  onDeleteChat,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const closeImagePreview = () => {
    setImagePreview(null);
    setIsImageZoomed(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBackMobile}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-neutral-700 transition hover:bg-neutral-100 xl:hidden"
            aria-label="Sohbet listesine dön"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-bold text-white sm:h-12 sm:w-12">
            {getInitials(contact.firstName, contact.lastName)}

            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                contact.isOnline ? "bg-emerald-500" : "bg-neutral-300"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-neutral-950">
              {contact.firstName} {contact.lastName}
            </h2>

            <p className="mt-1 truncate text-sm text-neutral-500">
              {contact.isOnline ? "Çevrim içi" : "Çevrim dışı"} ·{" "}
              {contact.department}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDeleteChat}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Sohbeti sil"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 px-3 py-4 sm:px-5 sm:py-5 [scrollbar-color:#d4d4d4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="space-y-4">
          {messages.map((message) => {
            const isMine = message.sender === "me";

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.5rem] border px-4 py-3 shadow-sm sm:max-w-[70%] ${
                    isMine
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-blue-100 bg-blue-50 text-blue-950"
                  }`}
                >
                  {message.type === "text" && (
                    <p className="text-sm leading-6">{message.content}</p>
                  )}

                  {message.type === "file" && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          isMine ? "bg-white/10" : "bg-white"
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {message.fileName}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isMine ? "text-white/60" : "text-blue-700/70"
                          }`}
                        >
                          {message.fileSize}
                        </p>
                      </div>

                      {message.fileUrl && (
                        <a
                          href={message.fileUrl}
                          download={message.fileName}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            isMine
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-white text-blue-950 hover:bg-blue-100"
                          }`}
                          aria-label="Belgeyi indir"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}

                  {message.type === "media" && (
                    <div className="space-y-3">
                      {isImageFile(message.fileName) && message.fileUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setImagePreview({
                              src: message.fileUrl as string,
                              fileName: message.fileName ?? "gorsel",
                            })
                          }
                          className="block cursor-zoom-in overflow-hidden rounded-2xl"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={message.fileUrl}
                            alt={message.fileName}
                            className="max-h-72 object-cover transition hover:scale-[1.02]"
                          />
                        </button>
                      )}

                      {isVideoFile(message.fileName) && message.fileUrl && (
                        <video
                          src={message.fileUrl}
                          controls
                          className="max-h-72 rounded-2xl"
                        />
                      )}

                      {!isImageFile(message.fileName) &&
                        !isVideoFile(message.fileName) && (
                          <div className="flex items-center gap-3">
                            <ImageIcon className="h-5 w-5" />
                            <span className="text-sm font-semibold">
                              {message.fileName}
                            </span>
                          </div>
                        )}

                      <p className="text-xs opacity-70">
                        {message.fileName} · {message.fileSize}
                      </p>
                    </div>
                  )}

                  {message.type === "audio" && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">
                        {message.content}
                      </p>

                      {message.fileUrl && (
                        <audio
                          src={message.fileUrl}
                          controls
                          className="w-full max-w-72"
                        />
                      )}

                      <p className="text-xs opacity-70">{message.fileSize}</p>
                    </div>
                  )}

                  <div
                    className={`mt-2 flex items-center justify-end gap-1 text-[11px] font-medium ${
                      isMine ? "text-white/50" : "text-blue-700/60"
                    }`}
                  >
                    <span>{formatTime(message.createdAt)}</span>

                    {isMine && <MessageStatusIcon status={message.status} />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {imagePreview && (
        <div className="fixed inset-0 z-[80] bg-neutral-950/95">
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 bg-neutral-950/70 px-4 py-4 backdrop-blur-md">
            <button
              type="button"
              onClick={closeImagePreview}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Görseli kapat"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="min-w-0 flex-1 truncate px-2 text-sm font-semibold text-white">
              {imagePreview.fileName}
            </p>

            <a
              href={imagePreview.src}
              download={imagePreview.fileName}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Görseli indir"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>

          <div className="flex h-full w-full items-center justify-center overflow-auto px-4 pb-8 pt-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview.src}
              alt={imagePreview.fileName}
              onClick={() => setIsImageZoomed((prev) => !prev)}
              className={`select-none rounded-2xl object-contain transition-transform duration-300 ${
                isImageZoomed
                  ? "max-w-none scale-150 cursor-zoom-out"
                  : "max-h-[82dvh] max-w-full cursor-zoom-in"
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}