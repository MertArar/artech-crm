"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Backend bağlanınca parola sıfırlama maili burada gönderilecek.
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm lg:grid-cols-[1fr_0.95fr]">
          <section className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300">
                Artech CRM
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
                Hesabınıza güvenli şekilde yeniden erişin.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400">
                Parolanızı unuttuysanız, kayıtlı e-posta adresinize güvenli bir
                sıfırlama bağlantısı gönderebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">01</p>
                <p className="mt-2 text-sm text-neutral-400">
                  E-posta girilir
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">02</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Bağlantı gönderilir
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">03</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Yeni parola belirlenir
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-10 flex flex-col items-center text-center">
                <Image
                  src="/artech-logo.png"
                  alt="Artech CRM"
                  width={170}
                  height={48}
                  priority
                  className="h-10 w-auto"
                />

                <h2 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-950">
                  Parolanızı mı unuttunuz?
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Kayıtlı e-posta adresinizi girin. Size parola sıfırlama
                  bağlantısı gönderelim.
                </p>
              </div>

              {isSubmitted ? (
                <div className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-neutral-950">
                    Bağlantı gönderildi
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Eğer bu e-posta adresi sistemde kayıtlıysa, parola sıfırlama
                    bağlantısı kısa süre içinde gönderilecektir.
                  </p>

                  <Link
                    href="/login"
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Giriş sayfasına dön
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      E-posta
                    </label>

                    <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                      <Mail className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        placeholder="ornek@firma.com"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-14 w-full cursor-pointer rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Sıfırlama Bağlantısı Gönder
                  </button>

                  <Link
                    href="/login"
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Giriş sayfasına dön
                  </Link>
                </form>
              )}

              <p className="mt-8 text-center text-xs leading-5 text-neutral-400">
                Güvenlik nedeniyle bağlantı yalnızca belirli bir süre geçerli
                olacaktır.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}