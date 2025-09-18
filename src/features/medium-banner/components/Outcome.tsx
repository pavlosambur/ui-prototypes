import { outcomePriceNormalizer } from "@/utils/index";
import type { PriceItem } from "./MediumBannerItem";

const Outcome: React.FC<PriceItem> = ({ price, market }) => {
  return (
    <div className="bg-control-secondary flex h-full w-full flex-col items-center justify-center rounded-lg">
      <div className="flex">
        <span className="text-text-outcome text-[16px] leading-5 font-medium">
          {outcomePriceNormalizer(price)}
        </span>
      </div>
      <div className="flex">
        <span className="text-text-body text-[10px] leading-3.5 font-semibold uppercase">
          {market}
        </span>
      </div>
    </div>
  );
};

export default Outcome;
