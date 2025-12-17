import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  title?: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  image: string;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  name,
  date,
  rating,
  comment,
  image,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && (
        <h3 className="font-semibold text-lg text-[#13000A]">{title}</h3>
      )}
      <div className="flex gap-4">
        <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <h4 className="font-bold text-[#13000A]">{name}</h4>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={i <= rating ? "#FDB022" : "#D0D5DD"}
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-1">{comment}</p>
        </div>
      </div>
    </div>
  );
};
