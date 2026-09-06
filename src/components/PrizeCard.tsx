import { useState } from "react";

interface PrizeCardProps {
  name: string;
  price?: string;
  image?: string;
}

function PrizeCard({
  name,
  price,
  image,
}: PrizeCardProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="w-36 p-[1px] rounded-xl bg-gradient-to-br from-[#00F0FF]/60 via-[#E000FF]/60 to-[#2596be]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-3">
          {/* Image */}
          <div
            className="aspect-[3/4] overflow-hidden rounded-lg bg-black/30 cursor-pointer"
            onClick={() => image && setIsZoomed(true)}
          >
            {image && (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            )}
          </div>

          {/* Information */}
          <div className="mt-2 text-center text-xs">
            <p className="font-futura-heavy font-bold leading-tight text-cyan-300">
              {name}
            </p>

            {price && (
              <p className="mt-0.5 font-futura-book text-[#E000FF]">
                {price}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isZoomed && image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={image}
            alt={name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
}

export default PrizeCard;