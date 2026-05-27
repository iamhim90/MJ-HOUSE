import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "../../data/siteContent";

export default function Gallery() {
  const { gallery } = siteContent;
  const [activeIndex, setActiveIndex] = useState(0);

  const currentImage = gallery.images[activeIndex];
  const visibleThumbnails = 8;
  const maxScroll = Math.max(0, gallery.images.length - visibleThumbnails);
  const [thumbnailScroll, setThumbnailScroll] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? gallery.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === gallery.images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const scrollThumbnails = (direction) => {
    const newScroll = Math.max(
      0,
      Math.min(maxScroll, thumbnailScroll + (direction === "left" ? -1 : 1))
    );
    setThumbnailScroll(newScroll);
  };

  return (
    <section id="gallery" className="relative bg-[#0b0906] py-20 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        {/* Main Image with Caption */}
        <div className="relative mb-8">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={currentImage.src}
              alt={currentImage.title}
              className="h-auto w-full object-cover"
            />

            {/* Badge Overlay */}
            {currentImage.badge && (
              <div className="absolute left-6 top-6 bg-[#c9a96e] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0b0906]">
                {currentImage.badge}
              </div>
            )}

            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent px-6 py-8 sm:px-8 sm:py-12">
              <h3 className="font-display text-xl font-medium text-white sm:text-2xl">
                {currentImage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#c7c1b8] sm:text-base">
                {currentImage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Indicators and Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {gallery.images.map((_, index) => (
              <div
                key={index}
                className={`h-1 transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[#c9a96e]"
                    : "w-2 bg-[#c9a96e]/30"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/50 text-[#c9a96e] transition-all hover:bg-[#c9a96e]/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/50 text-[#c9a96e] transition-all hover:bg-[#c9a96e]/10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="relative">
          <div className="flex gap-2 overflow-hidden">
            {gallery.images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-300 sm:h-24 sm:w-24 ${
                  index === activeIndex
                    ? "border-[#c9a96e]"
                    : "border-[#c9a96e]/30 hover:border-[#c9a96e]/60"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}