import { Composition, Folder } from "remotion";
import {
  ArianeDemo,
  BacklogScene,
  ClosingScene,
  OpeningScene,
  ProductScene,
} from "./ArianeDemo";

export const MyComposition: React.FC = () => {
  return (
    <>
      <Folder name="Scenes">
        <Composition id="Opening" component={OpeningScene} durationInFrames={135} fps={30} width={1920} height={1080} />
        <Composition id="Backlog" component={BacklogScene} durationInFrames={135} fps={30} width={1920} height={1080} />
        <Composition id="Product" component={ProductScene} durationInFrames={870} fps={30} width={1920} height={1080} />
        <Composition id="Closing" component={ClosingScene} durationInFrames={225} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition
        id="ArianeDemo"
        component={ArianeDemo}
        durationInFrames={1320}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
