import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

await Promise.all([
  loadFont({ family: "Inter", url: staticFile("fonts/inter-variable.ttf"), weight: "400 900" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-variable.ttf"), weight: "200 800" }),
]);

const colors = {
  background: "#f7f8fc",
  foreground: "#202333",
  primary: "#5b5ce2",
  primaryDark: "#4748bf",
  soft: "#efefff",
  border: "#dde2ea",
  muted: "#5f6675",
  white: "#ffffff",
};

const base: React.CSSProperties = {
  backgroundColor: colors.background,
  color: colors.foreground,
  fontFamily: "Inter, Arial, sans-serif",
};

const rise = (frame: number, start: number, distance = 44): React.CSSProperties => ({
  opacity: interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
  translate: `0 ${interpolate(frame, [start, start + 18], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })}px`,
});

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 999,
      backgroundColor: colors.soft,
      color: colors.primaryDark,
      padding: "14px 24px",
      fontSize: 24,
      fontWeight: 750,
      letterSpacing: 2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ ...base, padding: "110px 140px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          right: -170,
          top: -160,
          borderRadius: 190,
          backgroundColor: colors.soft,
          rotate: `${interpolate(frame, [0, 135], [-8, 3])}deg`,
        }}
      />
      <CanvasImage
        src={staticFile("brand/ariane-symbol.png")}
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          objectFit: "contain",
          right: 170,
          top: 150,
          ...rise(frame, 8, 30),
        }}
      />
      <div style={{ ...rise(frame, 0), position: "relative" }}>
        <Eyebrow>Le retard s’accumule</Eyebrow>
      </div>
      <h1
        style={{
          ...rise(frame, 10),
          position: "relative",
          maxWidth: 1280,
          margin: "58px 0 0",
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: 116,
          lineHeight: 0.98,
          letterSpacing: -5,
          fontWeight: 650,
        }}
      >
        Six mois de file.
        <span style={{ display: "block", color: colors.primary }}>Le temps expert sous pression.</span>
      </h1>
      <p
        style={{
          ...rise(frame, 22),
          position: "relative",
          width: 1100,
          margin: "54px 0 0",
          color: colors.muted,
          fontSize: 38,
          lineHeight: 1.35,
        }}
      >
        Reconstituer chaque historique mobilise l’expertise sur une tâche répétitive.
      </p>
    </AbsoluteFill>
  );
};

export const BacklogScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ ...base, padding: "100px 120px" }}>
      <div style={{ ...rise(frame, 0), textAlign: "center" }}>
        <Eyebrow>Objectif opérationnel</Eyebrow>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px 1fr", alignItems: "center", gap: 70, marginTop: 95 }}>
        <div style={{ ...rise(frame, 8), textAlign: "right" }}>
          <div style={{ fontFamily: "Manrope", fontSize: 240, fontWeight: 650, lineHeight: 0.85 }}>6</div>
          <div style={{ marginTop: 34, color: colors.muted, fontSize: 38, fontWeight: 650 }}>mois de retard</div>
        </div>
        <div style={{ ...rise(frame, 17, 0), display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ height: 6, flex: 1, borderRadius: 999, backgroundColor: colors.border }} />
          <div style={{ width: 84, height: 84, display: "grid", placeItems: "center", borderRadius: 999, backgroundColor: colors.primary, color: colors.white, fontSize: 46 }}>→</div>
          <div style={{ height: 6, flex: 1, borderRadius: 999, backgroundColor: colors.primary }} />
        </div>
        <div style={{ ...rise(frame, 14) }}>
          <div style={{ color: colors.primary, fontFamily: "Manrope", fontSize: 240, fontWeight: 650, lineHeight: 0.85 }}>1</div>
          <div style={{ marginTop: 34, fontSize: 38, fontWeight: 650 }}>mois de file cible</div>
        </div>
      </div>
      <div
        style={{
          ...rise(frame, 30),
          width: 1280,
          margin: "90px auto 0",
          border: `2px solid ${colors.border}`,
          borderRadius: 26,
          backgroundColor: colors.white,
          padding: "25px 36px",
          color: colors.muted,
          textAlign: "center",
          fontSize: 28,
          lineHeight: 1.4,
        }}
      >
        Une ambition à mesurer avec une équipe pilote — pas un résultat déjà acquis.
      </div>
    </AbsoluteFill>
  );
};

const chapter = (frame: number) => {
  if (frame < 180) return "Importer et structurer";
  if (frame < 390) return "Préparer la routine";
  if (frame < 630) return "Garder les cas complexes visibles";
  return "Le biologiste valide";
};

export const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const captionFrame = frame % 210;

  return (
    <AbsoluteFill style={{ ...base, padding: "54px 68px 74px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <CanvasImage src={staticFile("brand/ariane-lockup.png")} style={{ width: 230, height: 76, objectFit: "contain" }} />
        <div style={{ color: colors.muted, fontSize: 24, fontWeight: 650 }}>Démonstrateur · données synthétiques</div>
      </div>
      <div
        style={{
          position: "relative",
          marginTop: 24,
          height: 820,
          overflow: "hidden",
          border: `2px solid ${colors.border}`,
          borderRadius: 34,
          backgroundColor: colors.white,
          boxShadow: "0 28px 80px rgba(32,35,51,0.14)",
        }}
      >
        <div style={{ height: 54, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `2px solid ${colors.border}`, backgroundColor: "#fafbfe" }}>
          <span style={{ width: 15, height: 15, borderRadius: 99, backgroundColor: "#d95663" }} />
          <span style={{ width: 15, height: 15, borderRadius: 99, backgroundColor: "#f4b860" }} />
          <span style={{ width: 15, height: 15, borderRadius: 99, backgroundColor: "#7bc5a8" }} />
        </div>
        <Video
          src={staticFile("showcase/product-demo.mp4")}
          premountFor={fps}
          muted
          objectFit="contain"
          style={{ position: "absolute", top: 54, left: 0, width: "100%", height: 766, backgroundColor: colors.white }}
        />
        <div
          style={{
            position: "absolute",
            left: 48,
            bottom: 42,
            display: "flex",
            alignItems: "center",
            gap: 18,
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 22,
            backgroundColor: "rgba(32,35,51,0.92)",
            boxShadow: "0 18px 60px rgba(32,35,51,0.24)",
            padding: "20px 28px",
            color: colors.white,
            fontSize: 32,
            fontWeight: 700,
            opacity: interpolate(captionFrame, [0, 12, 190, 209], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: `0 ${interpolate(captionFrame, [0, 14], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
          }}
        >
          <span style={{ color: "#a7a8ff" }}>●</span>
          {chapter(frame)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ ...base, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 100, alignItems: "center", padding: "110px 150px", backgroundColor: colors.primary, color: colors.white }}>
      <div>
        <div style={{ ...rise(frame, 0), display: "inline-flex", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, backgroundColor: "rgba(32,35,51,0.18)", padding: "15px 24px", fontSize: 25, fontWeight: 750 }}>
          ✦ Prix de la meilleure solution pour les patients
        </div>
        <h2 style={{ ...rise(frame, 12), maxWidth: 1150, margin: "60px 0 0", fontFamily: "Manrope", fontSize: 108, lineHeight: 1, letterSpacing: -5, fontWeight: 650 }}>
          Rattraper le retard.
          <span style={{ display: "block" }}>Garder l’expertise.</span>
        </h2>
        <p style={{ ...rise(frame, 25), maxWidth: 1050, margin: "50px 0 0", color: "rgba(255,255,255,0.84)", fontSize: 37, lineHeight: 1.4 }}>
          La décision reste entre les mains du biologiste.
        </p>
        <p style={{ ...rise(frame, 36), margin: "32px 0 0", color: "rgba(255,255,255,0.68)", fontSize: 25 }}>
          Objectif 6 → 1 mois · à confirmer en pilote
        </p>
      </div>
      <div style={{ ...rise(frame, 18, 28), display: "grid", placeItems: "center" }}>
        <div style={{ width: 430, height: 430, display: "grid", placeItems: "center", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 120, backgroundColor: colors.white, boxShadow: "0 32px 90px rgba(32,35,51,0.28)" }}>
          <CanvasImage src={staticFile("brand/ariane-symbol.png")} style={{ width: 300, height: 300, objectFit: "contain" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ArianeDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Opening" durationInFrames={135} premountFor={fps}><OpeningScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Backlog" durationInFrames={135} premountFor={fps}><BacklogScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Product" durationInFrames={870} premountFor={fps}><ProductScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence name="Closing" durationInFrames={225} premountFor={fps}><ClosingScene /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
