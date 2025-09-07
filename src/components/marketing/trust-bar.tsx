"use client";

import * as React from "react";

type Brand = {
  name: string;
};

const DEFAULT_BRANDS: Brand[] = [
  { name: "Acme" },
  { name: "Zenith" },
  { name: "Quantum" },
  { name: "Nimbus" },
  { name: "Aurora" },
];

export function TrustBar({ brands = DEFAULT_BRANDS }: { brands?: Brand[] }) {
  return (
    <section className="py-8 sm:py-10">
      <div className="container-pro">
        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground/70">
            Trusted by learners and educators
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center rounded-md border border-white/5 bg-card/30 backdrop-blur-sm h-14 sm:h-16 glass-hover"
            >
              <span className="text-sm sm:text-base font-semibold text-muted-foreground/80 tracking-wide">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

