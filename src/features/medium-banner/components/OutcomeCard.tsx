import Outcome from "./Outcome";
import type { PriceItem } from "./MediumBannerItem";

interface OutcomeCardProps {
  prices: PriceItem[];
}

const OutcomeCard: React.FC<OutcomeCardProps> = ({ prices }) => {
  return (
    <div className="flex p-2">
      <div className="flex h-14 w-full flex-row gap-1">
        {prices.map((item, index) => (
          <Outcome key={index} price={item.price} market={item.market} />
        ))}
      </div>
    </div>
  );
};

export default OutcomeCard;
