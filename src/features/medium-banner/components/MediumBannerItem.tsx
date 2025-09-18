import Content from "./Content";
import OutcomeCard from "./OutcomeCard";
import raw from "@/features/medium-banner/data/mock-data.json";
import rawText from "@/features/medium-banner/data/mock-data.json?raw";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface PriceItem {
  price: number;
  market: string;
}
export interface ContentProps {
  competitor1Name: string;
  competitor2Name: string;
  eventDate: string;
  eventStartTime: string;
  eventCategory: string;
  eventChampionship: string;
  eventStage: EventStage;
  eventPeriod?: string | null;
  eventTime?: string | null;
  serverCompetitor?: 1 | 2 | null | undefined;
  scoreInCurrentGameCompetitor1?: number | null | undefined;
  scoreInCurrentGameCompetitor2?: number | null | undefined;
  scoreInCurrentPeriodCompetitor1?: number | null | undefined;
  scoreInCurrentPeriodCompetitor2?: number | null | undefined;
  scoreInMatchCompetitor1?: number | null | undefined;
  scoreInMatchCompetitor2?: number | null | undefined;
}

export type EventStage = "pre-match" | "live";

export interface MediumBannerItemData extends ContentProps {
  marketType: string;
  prices: PriceItem[];
  mobileBackgroundImage: string;
  desktopBackgroundImage: string;
}

const mediumBannerData = raw as Record<string, MediumBannerItemData>;

// Extract file (textual) key order to preserve original JSON declaration order (numeric keys otherwise enumerate ascending)
const idOrder: string[] = [];
const topLevelKeyRegex = /^\s*"(\d+)":/gm;
let m: RegExpExecArray | null;
while ((m = topLevelKeyRegex.exec(rawText)) !== null) {
  idOrder.push(m[1]);
}

const orderedItems: [string, MediumBannerItemData][] = idOrder
  .filter((id) => Object.prototype.hasOwnProperty.call(mediumBannerData, id))
  .map((id) => [id, mediumBannerData[id]]);

const MediumBannerItem: React.FC = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      // navigation
      // pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
      }}
      style={{ width: "100%" }}
    >
      {orderedItems.map(([key, item]) => (
        <SwiperSlide key={key}>
          <div
            className="flex h-[256px] w-full flex-col justify-end overflow-hidden rounded-2xl"
            style={{
              backgroundImage: `url(medium-banner-images/${item.mobileBackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Content {...item} />
            <OutcomeCard prices={item.prices} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MediumBannerItem;
