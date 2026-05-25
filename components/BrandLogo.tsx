// components/BrandLogo.tsx

import Image from "next/image";

const gymWebsiteUrl = "https://salabrick.ro/";
const instagramUrl =
  "https://www.instagram.com/alecsmihai?igsh=YjQ2MHB1dXpsc3hq&utm_source=qr";

type BrandLogoProps = {
  variant?: "hero" | "footer";
};

export function BrandLogo({ variant = "hero" }: BrandLogoProps) {
  if (variant === "footer") {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href={gymWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Deschide site-ul Sala Brick Fitness Brothers"
          className="relative h-20 w-56 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-[0_20px_70px_rgba(22,101,52,0.14)]"
        >
          <Image
            src="/sala-brick-logo.png"
            alt="Sala Brick Fitness Brothers logo"
            fill
            sizes="224px"
            className="object-contain p-3"
          />
        </a>

        <div>
          <p className="text-sm font-semibold text-neutral-900">
            Creat pentru educatie nutritionala si fitness
          </p>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Estimari realiste, explicatii simple si ajustari treptate.
          </p>

          <a
            href={gymWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-xs font-semibold text-emerald-700 transition hover:text-emerald-600"
          >
            salabrick.ro
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative h-36 w-36 overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:h-44 sm:w-44">
        <Image
          src="/am-logo.png"
          alt="Alexandru Mihai logo"
          fill
          priority
          sizes="176px"
          className="object-contain p-2"
        />
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
          AM Calorie Calculator
        </p>

        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          by Alexandru Mihai
        </p>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-full border border-emerald-700/15 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-700/30 hover:bg-emerald-100"
        >
          Instagram: @alecsmihai
        </a>

        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
          Calculator BMR / TDEE construit pentru estimari realiste, clare si
          usor de folosit.
        </p>
      </div>
    </div>
  );
}