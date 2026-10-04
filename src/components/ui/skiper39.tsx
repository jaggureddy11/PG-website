import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
}

type SpriteRect = [number, number, number, number];

type Peep = {
  rect: SpriteRect;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setScale: (scale: number) => void;
  render: (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => void;
};

type Stage = { width: number; height: number };

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = (length: number) => Math.floor(Math.random() * length);

function CrowdCanvas({ src, rows = 15, cols = 7, className = "" }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let disposed = false;
    let imageReady = false;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();

    const createPeep = (rect: SpriteRect): Peep => {
      const peep: Peep = {
        rect,
        width: rect[2],
        height: rect[3],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setScale(scale) {
          peep.width = rect[2] * scale;
          peep.height = rect[3] * scale;
        },
        render(context, sprite) {
          context.save();
          context.translate(peep.x, peep.y);
          context.scale(peep.scaleX, 1);
          context.drawImage(
            sprite,
            rect[0],
            rect[1],
            rect[2],
            rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          context.restore();
        },
      };
      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 80 - 220 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : -peep.width;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startY, endX };
    };

    const render = () => {
      if (disposed || !imageReady) return;
      ctx.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(ctx, image));
    };

    const addPeepToCrowd = () => {
      if (disposed || availablePeeps.length === 0) return;
      const peep = availablePeeps.splice(randomIndex(availablePeeps.length), 1)[0];
      const { startY, endX } = resetPeep(peep);
      const duration = randomRange(9, 14);
      const timeline = gsap.timeline({
        onComplete: () => {
          if (disposed) return;
          const index = crowd.indexOf(peep);
          if (index !== -1) crowd.splice(index, 1);
          availablePeeps.push(peep);
          addPeepToCrowd();
        },
      });

      timeline.timeScale(randomRange(0.7, 1.25));
      timeline.to(peep, { duration, x: endX, ease: "none" }, 0);
      timeline.to(
        peep,
        {
          duration: 0.32,
          repeat: Math.ceil(duration / 0.64),
          yoyo: true,
          y: startY - 6,
          ease: "sine.inOut",
        },
        0,
      );
      peep.walk = timeline;
      crowd.push(peep);
      crowd.sort((first, second) => first.anchorY - second.anchorY);
    };

    const createSprites = () => {
      allPeeps.length = 0;
      const safeRows = Math.max(1, Math.floor(rows));
      const safeCols = Math.max(1, Math.floor(cols));
      const rectWidth = image.naturalWidth / safeRows;
      const rectHeight = image.naturalHeight / safeCols;

      for (let index = 0; index < safeRows * safeCols; index += 1) {
        allPeeps.push(
          createPeep([
            (index % safeRows) * rectWidth,
            Math.floor(index / safeRows) * rectHeight,
            rectWidth,
            rectHeight,
          ]),
        );
      }
    };

    const resize = () => {
      if (disposed) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stage.width * pixelRatio);
      canvas.height = Math.round(stage.height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (!imageReady || stage.width === 0 || stage.height === 0) return;

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      const scale = stage.width < 520 ? 0.78 : stage.width < 900 ? 1.05 : 1.25;
      allPeeps.forEach((peep) => peep.setScale(scale));

      if (reducedMotion.matches) {
        const count = Math.min(10, availablePeeps.length);
        for (let index = 0; index < count; index += 1) {
          const peep = availablePeeps.splice(randomIndex(availablePeeps.length), 1)[0];
          peep.x = (stage.width * (index + 0.5)) / count - peep.width / 2;
          peep.y = stage.height - peep.height + randomRange(-18, 42);
          peep.anchorY = peep.y;
          peep.scaleX = 1;
          crowd.push(peep);
        }
        crowd.sort((first, second) => first.anchorY - second.anchorY);
        render();
        return;
      }

      while (availablePeeps.length > 0) addPeepToCrowd();
      render();
    };

    const initialize = () => {
      if (disposed || imageReady || image.naturalWidth === 0) return;
      imageReady = true;
      createSprites();
      resize();
    };

    image.decoding = "async";
    image.onload = initialize;
    image.onerror = () => canvas.setAttribute("data-canvas-error", "true");
    image.src = src;
    if (image.complete && image.naturalWidth > 0) initialize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", resize);
    gsap.ticker.add(render);

    return () => {
      disposed = true;
      image.onload = null;
      image.onerror = null;
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`hero-crowd-canvas ${className}`} aria-hidden="true" />;
}

function Skiper39() {
  return (
    <section className="site-hero relative isolate flex w-full flex-col items-center overflow-hidden" aria-labelledby="site-hero-title">
      <div className="site-hero__copy container relative z-10 flex flex-col items-center text-center">
        <h1 className="hero-title" id="site-hero-title" data-reveal>
          Move in today.<br />Feel at <em>home</em> tonight.
        </h1>
        <form className="finder hero-finder" id="finder" data-reveal>
          <div className="finder__field">
            <label htmlFor="f-locality">Locality</label>
            <select id="f-locality" defaultValue="">
              <option value="">Anywhere in South BLR</option>
              <option>Kumaraswamy Layout</option>
              <option>Uttarahalli</option>
              <option>Banashankari</option>
              <option>Padmanabhanagar</option>
              <option>JP Nagar</option>
              <option>Jayanagar</option>
            </select>
          </div>
          <div className="finder__field">
            <label htmlFor="f-room">Room type</label>
            <select id="f-room" defaultValue="Any room type">
              <option>Any room type</option>
              <option>Single room</option>
              <option>Double sharing</option>
              <option>Triple sharing</option>
            </select>
          </div>
          <Button size="lg" type="submit" className="btn btn--blue finder__go">
            Find my room
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>
        <div className="hero__proof" data-reveal>
          <span className="hero__proof-item">4.8 Google rating</span>
          <i aria-hidden="true" />
          <span className="hero__proof-item">480+ happy residents</span>
          <i aria-hidden="true" />
          <span className="hero__proof-item">Family-run since 2019</span>
        </div>
      </div>
      <div className="site-hero__skyline pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden="true">
        <img
          src="/bangalore-city-landscape.svg"
          alt=""
          className="site-hero__skyline-image"
          width="2172"
          height="724"
          fetchPriority="high"
        />
      </div>
      <div className="hero-ground pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24" aria-hidden="true" />
    </section>
  );
}

export { CrowdCanvas, Skiper39 };
export default Skiper39;
