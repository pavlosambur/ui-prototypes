import classNames from "classnames";
import type { EventStage } from "./MediumBannerItem";
import Icon from "@/ui/Icons";
import type { ContentProps } from "./MediumBannerItem";

interface ContentBlockProps extends ContentProps {
  contentType: "date/stage" | "competitors" | "championship/tournament";
}

const Content: React.FC<ContentProps> = (props) => {
  return (
    <div className="flex-col">
      <ContentBlock contentType="date/stage" {...props} />
      <ContentBlock contentType="competitors" {...props} />
      <ContentBlock contentType="championship/tournament" {...props} />
    </div>
  );
};

const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const twBgColor =
    props.eventStage === "pre-match"
      ? "bg-medium-banner-content-background-prematch"
      : "bg-medium-banner-content-background-live";

  return (
    <div className="flex w-full min-w-0">
      <GradientBar direction="l" eventStage={props.eventStage} />
      <div
        className={classNames(
          "flex h-auto min-w-0 items-start justify-start", // ліве вирівнювання
          "px-2", // невеликий внутрішній відступ (можеш прибрати)
          twBgColor,
        )}
      >
        {props.contentType === "date/stage" && <DateStageBlock {...props} />}
        {props.contentType === "competitors" && <CompetitorsBlock {...props} />}
        {props.contentType === "championship/tournament" && (
          <ChampionshipBlock
            eventCategory={props.eventCategory}
            eventChampionship={props.eventChampionship}
          />
        )}
      </div>
      <GradientBar direction="r" eventStage={props.eventStage} />
    </div>
  );
};

/* ========== SUB BLOCKS ========== */

const DateStageBlock: React.FC<
  Pick<
    ContentProps,
    "eventStage" | "eventDate" | "eventStartTime" | "eventTime" | "eventPeriod"
  >
> = ({ eventStage, eventDate, eventStartTime, eventTime, eventPeriod }) => {
  const base = "text-[10px] leading-4";
  const color =
    eventStage === "pre-match"
      ? "text-text-medium-banner"
      : "text-text-medium-banner-live uppercase";
  return (
    <div className="flex items-center">
      <span className={classNames(color, base)}>
        {eventStage === "pre-match" && `${eventDate} ${eventStartTime}`}
        {eventStage === "live" && eventPeriod}
      </span>
      <span className={base}>&nbsp;</span>
      <span className={classNames(color, base)}>{eventTime}</span>
    </div>
  );
};

interface CompetitorsBlockProps
  extends Pick<
    ContentProps,
    | "eventStage"
    | "competitor1Name"
    | "competitor2Name"
    | "serverCompetitor"
    | "scoreInCurrentGameCompetitor1"
    | "scoreInCurrentGameCompetitor2"
    | "scoreInCurrentPeriodCompetitor1"
    | "scoreInCurrentPeriodCompetitor2"
    | "scoreInMatchCompetitor1"
    | "scoreInMatchCompetitor2"
  > {}

const CompetitorsBlock: React.FC<CompetitorsBlockProps> = (props) => {
  if (props.eventStage === "pre-match") {
    return (
      <div className="flex h-full min-w-0 items-center overflow-hidden">
        <span
          className={classNames(
            "text-text-medium-banner",
            "text-[18px] leading-5",
            "block break-words whitespace-normal", // перенос по словах
          )}
        >
          {props.competitor1Name} x {props.competitor2Name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-row items-start gap-1 overflow-hidden">
      <LiveNames
        eventStage={props.eventStage}
        c1={props.competitor1Name}
        c2={props.competitor2Name}
      />
      <ServerIndicators
        serverCompetitor={props.serverCompetitor ?? undefined}
      />
      <ScoresColumn
        a={props.scoreInCurrentGameCompetitor1 ?? undefined}
        b={props.scoreInCurrentGameCompetitor2 ?? undefined}
        colorClass="text-text-medium-banner"
      />
      <ScoresColumn
        a={props.scoreInCurrentPeriodCompetitor1 ?? undefined}
        b={props.scoreInCurrentPeriodCompetitor2 ?? undefined}
        colorClass="text-text-medium-banner"
      />
      <ScoresColumn
        a={props.scoreInMatchCompetitor1 ?? undefined}
        b={props.scoreInMatchCompetitor2 ?? undefined}
        colorClass="text-text-medium-banner-live"
      />
    </div>
  );
};

const LiveNames: React.FC<{
  c1: string;
  c2: string;
  eventStage: EventStage;
}> = ({ c1, c2, eventStage }) => {
  // лише для live — трюнкатимо кожен рядок
  if (eventStage !== "live") {
    // теоретично не викликається (pre-match оброблено вище), але залишимо безпечний fallback
    return (
      <div className="flex min-w-0 flex-col overflow-hidden">
        <span className="text-text-medium-banner text-[18px] leading-5 break-words whitespace-normal">
          {c1} x {c2}
        </span>
      </div>
    );
  }

  const lineCls = classNames(
    "text-text-medium-banner",
    "text-[18px] leading-5",
    "truncate block w-full",
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-w-0">
        <span className={lineCls}>{c1}</span>
      </div>
      <div className="flex min-w-0">
        <span className={lineCls}>{c2}</span>
      </div>
    </div>
  );
};

const ServerIndicators: React.FC<{ serverCompetitor?: number }> = ({
  serverCompetitor,
}) => {
  if (!serverCompetitor) return null;
  return (
    <div className="ml-1 flex h-full flex-col">
      <div className="flex h-full items-center">
        {serverCompetitor === 1 && (
          <span className="h-3 w-3">
            <Icon.Server color="var(--color-text-medium-banner)" />
          </span>
        )}
      </div>
      <div className="flex h-full items-center">
        {serverCompetitor === 2 && (
          <span className="h-3 w-3">
            <Icon.Server color="var(--color-text-medium-banner)" />
          </span>
        )}
      </div>
    </div>
  );
};

interface ScoresColumnProps {
  a?: number;
  b?: number;
  colorClass: string;
}

const ScoresColumn: React.FC<ScoresColumnProps> = ({ a, b, colorClass }) => {
  if (a == null || b == null) return null;
  const cls = (c: string) => classNames(c, "text-[12px] leading-5");
  return (
    <div className="ml-1 flex h-full shrink-0 flex-col">
      <div className="flex h-full items-center justify-center">
        <span className={cls(colorClass)}>{a}</span>
      </div>
      <div className="flex h-full items-center justify-center">
        <span className={cls(colorClass)}>{b}</span>
      </div>
    </div>
  );
};

const ChampionshipBlock: React.FC<{
  eventCategory: string;
  eventChampionship: string;
}> = ({ eventCategory, eventChampionship }) => (
  <span
    className={classNames("text-text-medium-banner", "text-[12px] leading-5")}
  >
    {eventCategory}. {eventChampionship}
  </span>
);

/* GRADIENT BAR */

interface GradientBarProps {
  direction: "l" | "r";
  eventStage: EventStage;
}

const GradientBar: React.FC<GradientBarProps> = ({ direction, eventStage }) => {
  const fromColor =
    eventStage === "pre-match"
      ? "from-[var(--color-medium-banner-content-background-prematch)]"
      : "from-[var(--color-medium-banner-content-background-live)]";
  return (
    <div
      className={classNames(
        "min-w-4",
        direction === "l" && "bg-gradient-to-l",
        direction === "r" && "bg-gradient-to-r",
        fromColor,
      )}
    />
  );
};

export default Content;
