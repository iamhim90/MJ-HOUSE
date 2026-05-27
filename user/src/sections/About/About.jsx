import eventPhoto from "../../assets/gallery/event-photo.jpeg";
import { siteContent } from "../../data/siteContent";

export default function About() {
  const { about } = siteContent;

  return (
    <section id="about" className="relative bg-[#0b0906] py-20 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Image */}
          <div className="flex items-center justify-center lg:order-first">
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={eventPhoto}
                alt="MJ Culture Dolphin Fountain - Iconic Venue Feature"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.52em] text-[#c9a96e]">
              <span className="h-px w-7 bg-[#c9a96e]/70" />
              <span>{about.eyebrow}</span>
            </div>

            <h2 className="font-display mt-6 text-[clamp(2.4rem,6vw,3.8rem)] font-medium leading-[1.1] text-[#f5f0e8]">
              {about.heading}
            </h2>

            <div className="mt-8 space-y-6 text-[16px] leading-[1.8] text-[#c7c1b8]">
              {about.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}