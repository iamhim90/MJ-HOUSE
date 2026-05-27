import { CalendarDays, Images, MessageCircle } from "lucide-react";

import heroReferenceBg from "../../assets/hero-reference-bg.jpg";
import logo from "../../assets/logo.png";
import Button from "../../components/Button/Button";
import { siteContent } from "../../data/siteContent";

export default function Hero() {
  const { hero } = siteContent;

  return (
    <section id="home" className="hero-stage relative isolate min-h-[100svh] overflow-hidden bg-[#0b0906] text-[#f6f1e8]">
      <div
        className="absolute inset-0 -z-40 bg-cover bg-[center_top] opacity-55"
        style={{ backgroundImage: `url(${heroReferenceBg})` }}
        aria-hidden="true"
      />
      <div className="hero-ambient absolute inset-0 -z-30" aria-hidden="true" />
      <div className="hero-orbit absolute left-1/2 top-[58%] -z-20 h-[min(72vw,700px)] w-[min(72vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1180px] flex-col items-center px-6 pb-[26px] pt-[92px] text-center sm:px-8 sm:pt-[28px]">
        <img
          src={logo}
          alt="MJ Culture Center"
          className="h-auto w-[82px] drop-shadow-[0_18px_42px_rgba(216,183,115,0.18)] sm:w-[134px] lg:w-[150px]"
        />

        <div className="mt-[26px] flex w-full max-w-[340px] items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[#c9a96e] sm:mt-[54px] sm:max-w-[520px] sm:gap-4 sm:text-[12px] sm:tracking-[0.52em]">
          <span className="h-px w-7 shrink-0 bg-[#c9a96e]/70 sm:w-9" />
          <span className="min-w-0 leading-[1.35]">{hero.eyebrow}</span>
          <span className="h-px w-7 shrink-0 bg-[#c9a96e]/70 sm:w-9" />
        </div>

        <h1 className="font-display mt-[24px] w-full text-[clamp(2.85rem,11.6vw,3.25rem)] font-medium leading-[1.02] tracking-normal text-white sm:mt-[44px] sm:text-[clamp(4.2rem,6.15vw,7.1rem)] sm:leading-[0.98]">
          {hero.titleLines.map(({ text, accent }, index) => (
            <span
              key={text}
              className={[
                "block",
                index === 2 ? "text-[0.94em]" : "",
                accent ? "text-[0.88em] font-normal italic text-[#d4b46f]" : "text-[#fffaf3]",
              ].join(" ")}
            >
              {text}
            </span>
          ))}
        </h1>

        <p className="mt-[24px] w-full max-w-[286px] text-[14px] font-semibold leading-[1.7] text-[#c7c1b8]/76 sm:mt-[34px] sm:max-w-[640px] sm:text-[19px] sm:leading-[1.95]">
          {hero.subtitle}
        </p>

        <div className="mt-[32px] flex w-full flex-col items-center justify-center gap-4 sm:mt-[100px] sm:flex-row sm:gap-5">
          <Button href={hero.primaryCTALink} icon={CalendarDays} className="min-w-[264px]">
            {hero.primaryCTA}
          </Button>

          <Button
            href={hero.secondaryCTALink}
            icon={Images}
            variant="outline"
            className="min-w-[244px]"
          >
            {hero.secondaryCTA}
          </Button>
        </div>
      </div>

      <a
        href="https://wa.me/919313846266"
        className="fixed bottom-6 right-6 z-40 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_0_0_12px_rgba(37,211,102,0.12),0_16px_40px_rgba(37,211,102,0.24)] transition-transform duration-300 hover:scale-105 sm:bottom-[38px] sm:right-[38px] sm:h-[68px] sm:w-[68px] sm:shadow-[0_0_0_16px_rgba(37,211,102,0.12),0_16px_40px_rgba(37,211,102,0.24)]"
        aria-label="Contact MJ Culture on WhatsApp"
      >
        <MessageCircle className="h-8 w-8" strokeWidth={2.2} />
      </a>
    </section>
  );
}
