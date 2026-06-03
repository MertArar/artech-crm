"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  getCountries,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input";

type CountryOption = {
  code: Country;
  name: string;
  callingCode: string;
};

export default function RegisterForm() {
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [email, setEmail] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<Country>("TR");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const countryNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(["tr"], { type: "region" });
    } catch {
      return null;
    }
  }, []);

  const countries = useMemo<CountryOption[]>(() => {
    return getCountries()
      .map((country) => ({
        code: country,
        name: countryNames?.of(country) ?? country,
        callingCode: getCountryCallingCode(country),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [countryNames]);

  const activeCountry = countries.find(
    (country) => country.code === selectedCountry
  );

  const filteredCountries = useMemo(() => {
    const normalizedSearch = countrySearch.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedSearch) {
      return countries;
    }

    return countries.filter((country) => {
      const searchableText = `${country.name} ${country.code} +${country.callingCode}`;

      return searchableText
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedSearch);
    });
  }, [countries, countrySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIdentityNumberChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const onlyNumbers = event.target.value.replace(/\D/g, "").slice(0, 11);
    setIdentityNumber(onlyNumbers);
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = event.target.value
      .replace(/[^\d\s()-]/g, "")
      .slice(0, 20);

    setPhoneNumber(cleanedValue);
  };

  const selectCountry = (country: CountryOption) => {
    setSelectedCountry(country.code);
    setIsCountryDropdownOpen(false);
    setCountrySearch("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullPhoneNumber = `+${
      activeCountry?.callingCode ?? "90"
    } ${phoneNumber}`;

    const registerPayload = {
      firstName,
      lastName,
      identityNumber,
      email,
      country: selectedCountry,
      phoneNumber: fullPhoneNumber,
      password,
      passwordAgain,
    };

    console.log(registerPayload);

    // Backend bağlanınca kayıt işlemi burada yapılacak.
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300">
                Artech CRM
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
                Ekibiniz için modern bir CRM çalışma alanı oluşturun.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400">
                Müşteri yönetimi, teklifler, görevler ve ekip iletişimi için
                sade, hızlı ve profesyonel bir başlangıç yapın.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">CRM</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Müşteri yönetimi
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">Todo</p>
                <p className="mt-2 text-sm text-neutral-400">Görev takibi</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">Chat</p>
                <p className="mt-2 text-sm text-neutral-400">Ekip iletişimi</p>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-2xl">
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
                  Yeni hesap oluşturun
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  CRM paneline erişmek için kullanıcı bilgilerinizi girin.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Adı
                    </label>

                    <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                      <User className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                        required
                        placeholder="Mert"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Soyadı
                    </label>

                    <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                      <User className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                        required
                        placeholder="Arar"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="identityNumber"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    TC Kimlik No
                  </label>

                  <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                    <IdCard className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                    <input
                      id="identityNumber"
                      name="identityNumber"
                      type="text"
                      value={identityNumber}
                      onChange={handleIdentityNumberChange}
                      inputMode="numeric"
                      maxLength={11}
                      minLength={11}
                      pattern="[0-9]{11}"
                      required
                      placeholder="11 haneli TC kimlik no"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

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

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Telefon Numarası
                  </label>

                  <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                    <div ref={countryDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setIsCountryDropdownOpen((prev) => !prev)
                        }
                        className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 text-left transition ${
                          isCountryDropdownOpen
                            ? "border-neutral-600 shadow-sm"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={`fi fi-${selectedCountry.toLowerCase()} h-4 w-6 shrink-0 rounded-sm`}
                          />

                          <span className="truncate text-sm font-semibold text-neutral-950">
                            +{activeCountry?.callingCode ?? "90"}
                          </span>
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-neutral-400 transition ${
                            isCountryDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isCountryDropdownOpen && (
                        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[300px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl sm:w-[330px]">
                          <div className="border-b border-neutral-100 p-3">
                            <div className="flex h-11 items-center rounded-xl bg-neutral-50 px-3">
                              <Search className="mr-2 h-4 w-4 shrink-0 text-neutral-400" />

                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(event) =>
                                  setCountrySearch(event.target.value)
                                }
                                placeholder="Ülke veya kod ara..."
                                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                              />
                            </div>
                          </div>

                          <div className="max-h-72 overflow-y-auto p-2">
                            {filteredCountries.map((country) => {
                              const isSelected =
                                country.code === selectedCountry;

                              return (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => selectCountry(country)}
                                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                    isSelected
                                      ? "bg-neutral-100 text-neutral-950"
                                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                                  }`}
                                >
                                  <span
                                    className={`fi fi-${country.code.toLowerCase()} h-4 w-6 shrink-0 rounded-sm`}
                                  />

                                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {country.name}
                                  </span>

                                  <span className="text-sm font-semibold text-neutral-500">
                                    +{country.callingCode}
                                  </span>
                                </button>
                              );
                            })}

                            {filteredCountries.length === 0 && (
                              <div className="px-3 py-6 text-center text-sm text-neutral-500">
                                Ülke bulunamadı.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                      <Phone className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        autoComplete="tel"
                        required
                        placeholder="Telefon numarası"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
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
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                        placeholder="Parola"
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

                  <div>
                    <label
                      htmlFor="passwordAgain"
                      className="mb-2 block text-sm font-semibold text-neutral-800"
                    >
                      Parola Tekrar
                    </label>

                    <div className="group flex h-14 items-center rounded-2xl border border-neutral-200 bg-white px-4 transition focus-within:border-neutral-600 focus-within:shadow-sm">
                      <Lock className="mr-3 h-5 w-5 shrink-0 text-neutral-400 transition group-focus-within:text-neutral-700" />

                      <input
                        id="passwordAgain"
                        name="passwordAgain"
                        type={showPasswordAgain ? "text" : "password"}
                        value={passwordAgain}
                        onChange={(event) =>
                          setPasswordAgain(event.target.value)
                        }
                        autoComplete="new-password"
                        required
                        placeholder="Parola tekrar"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPasswordAgain((prev) => !prev)}
                        className="ml-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                        aria-label={
                          showPasswordAgain
                            ? "Parolayı gizle"
                            : "Parolayı göster"
                        }
                      >
                        {showPasswordAgain ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-14 w-full cursor-pointer rounded-2xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Hesap Oluştur
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-500">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-neutral-950 transition hover:text-neutral-700"
                >
                  Giriş yapın
                </Link>
              </p>

              <p className="mt-4 text-center text-xs leading-5 text-neutral-400">
                Hesap oluşturarak yetkili kullanıcı politikalarını kabul etmiş
                olursunuz.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}