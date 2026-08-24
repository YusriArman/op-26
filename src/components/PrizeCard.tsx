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
  return (
    <div className="w-32">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-300">
        {image && (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* Information */}
      <div className="mt-2 text-center text-xs">
        <p className="font-medium leading-tight">
          {name}
        </p>

        {price && (
          <p className="mt-0.5 text-gray-600">
            {price}
          </p>
        )}
      </div>
    </div>
  );
}

export default PrizeCard;