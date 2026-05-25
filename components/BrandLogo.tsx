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
          className="relative h-20 w-56 overflow-hidden rounded-2xl border border-neutral-800 bg-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-emerald-950/20"
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
          <p className="text-sm font-medium text-neutral-300">
            Creat pentru educatie nutritionala si fitness
          </p>
          <p className="mt-1 text-xs leading-5 text-neutral-600">
            Estimari realiste, explicatii simple si ajustari treptate.
          </p>
          <a
            href={gymWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            salabrick.ro
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative h-36 w-36 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/70 shadow-2xl shadow-black/40 sm:h-44 sm:w-44">
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
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-400">
          AM Calorie Calculator
        </p>

        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
          by Alexandru Mihai
        </p>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex rounded-full border border-neutral-800 bg-neutral-950/60 px-3 py-1.5 text-sm font-medium text-neutral-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
        >
          Instagram: @alecsmihai
        </a>

        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
          Calculator BMR / TDEE construit pentru estimari realiste, clare si
          usor de folosit.
        </p>
      </div>
    </div>
  );
}