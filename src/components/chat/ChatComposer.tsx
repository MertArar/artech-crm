"use client";

import {
  FileText,
  Mic,
  Plus,
  Send,
  Square,
  Video,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { ChatMessage } from "@/data/chat";
import { documentAccept, formatFileSize, mediaAccept } from "./chatUtils";

type OutgoingMessagePayload = Omit<
  ChatMessage,
  "id" | "chatUserId" | "sender" | "createdAt"
>;

type ChatComposerProps = {
  onAddOutgoingMessage: (message: OutgoingMessagePayload) => void;
};

export default function ChatComposer({
  onAddOutgoingMessage,
}: ChatComposerProps) {
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentMenuRef = useRef<HTMLDivElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [messageValue, setMessageValue] = useState("");
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node)
      ) {
        setIsAttachmentMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = messageValue.trim();

    if (!trimmedMessage) {
      return;
    }

    onAddOutgoingMessage({
      type: "text",
      content: trimmedMessage,
    });

    setMessageValue("");
  };

  const handleDocumentSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    selectedFiles.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);

      onAddOutgoingMessage({
        type: "file",
        content: "Belge gönderildi",
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileUrl,
      });
    });

    event.target.value = "";
    setIsAttachmentMenuOpen(false);
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    selectedFiles.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);

      onAddOutgoingMessage({
        type: "media",
        content: "Fotoğraf / video gönderildi",
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileUrl,
      });
    });

    event.target.value = "";
    setIsAttachmentMenuOpen(false);
  };

  const stopAudioTracks = () => {
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const startRecording = async () => {
    setRecordingError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setRecordingError("Tarayıcı ses kaydını desteklemiyor.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const audioUrl = URL.createObjectURL(audioBlob);

        onAddOutgoingMessage({
          type: "audio",
          content: "Ses kaydı",
          fileName: "ses-kaydi.webm",
          fileSize: formatFileSize(audioBlob.size),
          fileUrl: audioUrl,
        });

        stopAudioTracks();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError("Mikrofon izni alınamadı.");
      setIsRecording(false);
      stopAudioTracks();
    }
  };

  const handleRecordingButtonClick = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  return (
    <div className="border-t border-neutral-100 bg-white p-2 sm:p-4">
      {recordingError && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {recordingError}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <input
          ref={documentInputRef}
          type="file"
          multiple
          accept={documentAccept}
          onChange={handleDocumentSelect}
          className="hidden"
        />

        <input
          ref={mediaInputRef}
          type="file"
          multiple
          accept={mediaAccept}
          onChange={handleMediaSelect}
          className="hidden"
        />

        <div ref={attachmentMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsAttachmentMenuOpen((prev) => !prev)}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border transition sm:rounded-2xl ${
              isAttachmentMenuOpen
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
            aria-label="Dosya ekle"
          >
            <Plus className="h-5 w-5" />
          </button>

          {isAttachmentMenuOpen && (
            <div className="absolute bottom-[calc(100%+10px)] left-0 z-30 w-64 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white p-2 shadow-2xl">
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    Belge
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    PDF, Word, Excel, PPT, TXT
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => mediaInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                  <Video className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    Fotoğraf / Video
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Görsel ve video dosyaları
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-3 transition focus-within:border-neutral-700 focus-within:bg-white focus-within:shadow-sm sm:rounded-2xl">
          <input
            type="text"
            value={messageValue}
            onChange={(event) => setMessageValue(event.target.value)}
            placeholder="Mesaj yaz..."
            className="h-7 w-full bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>

        <button
          type="button"
          onClick={handleRecordingButtonClick}
          className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border transition sm:rounded-2xl ${
            isRecording
              ? "border-red-500 bg-red-500 text-white"
              : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
          }`}
          aria-label={isRecording ? "Ses kaydını durdur" : "Ses kaydet"}
        >
          {isRecording ? (
            <Square className="h-5 w-5 fill-current" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>

        <button
          type="submit"
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 sm:rounded-2xl"
          aria-label="Mesaj gönder"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}