"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Backend bağlanınca login işlemi burada yapılacak.
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
                Müşteri, teklif ve ekip işlerinizi tek panelden yönetin.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400">
                Satış sürecinizi, görevlerinizi ve müşteri ilişkilerinizi sade,
                hızlı ve modern bir CRM panelinde bir araya getirin.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">CRM</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Müşteri takibi
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">Todo</p>
                <p className="mt-2 text-sm text-neutral-400">Görev yönetimi</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">Chat</p>
                <p className="mt-2 text-sm text-neutral-400">Ekip iletişimi</p>
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
                  Hesabınıza giriş yapın
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  CRM panelinize erişmek için bilgilerinizi girin.
                </p>
              </div>

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
                      autoComplete="email"
                      required
                      placeholder="ornek@firma.com"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Parola
                  </label>

                  <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                    <Lock className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Parolanızı girin"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="ml-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                      aria-label={
                        showPassword ? "Parolayı gizle" : "Parolayı göster"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-600">
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-neutral-300 bg-white transition checked:border-neutral-950 checked:bg-neutral-950"
                      />

                      <svg
                        viewBox="0 0 24 24"
                        className="pointer-events-none absolute h-3.5 w-3.5 scale-50 text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>

                    Oturum açık kalsın
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-neutral-700 transition hover:text-neutral-950"
                  >
                    Parolamı unuttum
                  </Link>
                </div>

                <button
                  type="submit"
                  className="h-14 w-full cursor-pointer rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Giriş Yap
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Hesabınız yok mu?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-neutral-950 transition hover:text-neutral-700"
                >
                  Hesap oluşturun
                </Link>
              </p>

              <p className="mt-8 text-center text-xs leading-5 text-neutral-400">
                Bu panel yalnızca yetkili kullanıcılar içindir.
              </p>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}