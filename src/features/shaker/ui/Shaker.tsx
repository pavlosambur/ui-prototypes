import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Accel = { x: number; y: number; z: number };

const getAccel = (e: DeviceMotionEvent): Accel | null => {
  // Prefer acceleration (without gravity) when available, else includingGravity
  const a = e.acceleration || e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null || a.z == null) return null;
  return { x: a.x, y: a.y, z: a.z };
};

const needIOSPermission = () =>
  typeof DeviceMotionEvent !== "undefined" &&
  // @ts-expect-error - requestPermission exists on iOS Safari
  typeof DeviceMotionEvent.requestPermission === "function";

const requestMotionPermission = async (): Promise<boolean> => {
  if (!needIOSPermission()) return true;
  try {
    // @ts-expect-error - iOS Safari specific API
    const res: PermissionState = await DeviceMotionEvent.requestPermission();
    return res === "granted";
  } catch {
    return false;
  }
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomGradient = () => {
  const h1 = randomInt(0, 360);
  const h2 = (h1 + randomInt(60, 180)) % 360;
  const s1 = randomInt(70, 95);
  const l1 = randomInt(45, 60);
  const s2 = randomInt(70, 95);
  const l2 = randomInt(45, 60);
  return `linear-gradient(135deg, hsl(${h1} ${s1}% ${l1}%), hsl(${h2} ${s2}% ${l2}%))`;
};

const useShake = (
  onShake: () => void,
  opts?: { threshold?: number; debounceMs?: number },
) => {
  const { threshold = 28, debounceMs = 1000 } = opts || {};
  const lastAccelRef = useRef<Accel | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = getAccel(e);
      if (!acc) return;
      const last = lastAccelRef.current;
      const now = Date.now();
      if (last) {
        const dx = Math.abs(acc.x - last.x);
        const dy = Math.abs(acc.y - last.y);
        const dz = Math.abs(acc.z - last.z);
        const speed = dx + dy + dz; // simple, effective

        if (speed > threshold && now - lastTimeRef.current > debounceMs) {
          lastTimeRef.current = now;
          onShake();
        }
      }
      lastAccelRef.current = acc;
    };

    window.addEventListener("devicemotion", onMotion, { passive: true });
    return () =>
      window.removeEventListener("devicemotion", onMotion as EventListener);
  }, [onShake, threshold, debounceMs]);
};

const Shaker: React.FC = () => {
  const [bg, setBg] = useState<string>(() => randomGradient());
  const [motionReady, setMotionReady] = useState<boolean>(
    () => !needIOSPermission(),
  );

  const trigger = useCallback(() => setBg(randomGradient()), []);

  useShake(trigger);

  useEffect(() => {
    if (!motionReady && !needIOSPermission()) setMotionReady(true);
  }, [motionReady]);

  const askPermission = async () => {
    const granted = await requestMotionPermission();
    setMotionReady(granted);
  };

  const circleStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundImage: bg,
      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      transition: "background-image 300ms ease",
    }),
    [bg],
  );

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] w-full items-center justify-center p-4">
      <div className="flex max-w-[720px] flex-col items-center gap-6">
        <div
          role="button"
          aria-label="Shake circle"
          tabIndex={0}
          onClick={trigger}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && trigger()}
          className="size-48 shrink-0 rounded-full ring-0 outline-none select-none"
          style={circleStyle}
        />
        <div className="text-center text-sm text-white/80">
          {!motionReady && (
            <button
              type="button"
              onClick={askPermission}
              className="mt-3 rounded-lg bg-white/10 px-3 py-1.5 text-white backdrop-blur hover:bg-white/15"
            >
              Дозволити доступ до датчиків руху (iOS)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shaker;
