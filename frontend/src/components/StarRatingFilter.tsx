import React from "react";

type StarRatingFilterProps = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const StarRatingFilter = ({
  selectedStars,
  onChange,
}: StarRatingFilterProps) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Property Rating</h4>
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`star-${star}`}
            value={star.toString()}
            checked={selectedStars.includes(star.toString())} //if the selectedStars array includes the current star then the checkbox will be checked
            onChange={onChange}
          />
          <label htmlFor={`star-${star}`} className="text-sm">
            {star} <span className="text-xs">star</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default StarRatingFilter;
