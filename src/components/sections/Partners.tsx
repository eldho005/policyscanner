"use client";

import Image from "next/image";

const ALL_CARRIERS = [
  { code: "MANU", name: "Manulife" },
  { code: "SUNL", name: "Sun Life" },
  { code: "CANA", name: "Canada Life" },
  { code: "RBCL", name: "RBC Insurance" },
  { code: "DESJ", name: "Desjardins" },
  { code: "INDU", name: "iA Financial" },
  { code: "BMOL", name: "BMO Insurance" },
  { code: "EMPI", name: "Empire Life" },
  { code: "EQUI", name: "Equitable Life" },
  { code: "FORE", name: "Foresters" },
  { code: "BENE", name: "Beneva" },
  { code: "ASSU", name: "Assumption Life" },
];

function logoUrl(code: string) {
  return `https://www.compulifeapi.com/images/logosapicanada/${code}-medium.png`;
}

/* Duplicate the list so the scroll seamlessly loops */
const logos = [...ALL_CARRIERS, ...ALL_CARRIERS];

export default function Partners() {
  return (
    <section className="py-10 border-y border-border-light bg-white">
      <div className="max-w-[1120px] mx-auto px-7 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex items-center gap-10 sm:gap-14 animate-marquee w-max">
          {logos.map((carrier, i) => (
            <div
              key={`${carrier.code}-${i}`}
              className="flex-shrink-0 w-[120px] sm:w-[140px] h-12 flex items-center justify-center group"
            >
              <Image
                src={logoUrl(carrier.code)}
                alt={carrier.name}
                width={140}
                height={44}
                className="object-contain max-h-9 w-auto h-auto opacity-40 max-sm:opacity-60 grayscale group-hover:opacity-70 group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


