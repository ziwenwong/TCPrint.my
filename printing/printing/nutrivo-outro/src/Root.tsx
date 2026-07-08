import "./index.css";
import { Composition } from "remotion";
import { NutrivoOutro, NutrivoWaterOutro } from "./Composition";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="NutrivoOutro"
        component={NutrivoOutro}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NutrivoWaterOutro"
        component={NutrivoWaterOutro}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
