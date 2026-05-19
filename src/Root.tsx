import "./index.css";
import { Composition } from "remotion";
import { GenerativeArt } from "./compositions/GenerativeArt";
import { CountdownTimer } from "./compositions/CountdownTimer";
import { GitHubGraph } from "./compositions/GitHubGraph";
import { CodeTypewriter } from "./compositions/CodeTypewriter";
import { BarChartRace } from "./compositions/BarChartRace";
import { QuoteCard } from "./compositions/QuoteCard";
import { LowerThirds } from "./compositions/LowerThirds";
import { AnimatedResume } from "./compositions/AnimatedResume";
import { YearInReview } from "./compositions/YearInReview";
import { IntroBumper } from "./compositions/IntroBumper";
import { MusicVisualizer } from "./compositions/MusicVisualizer";
import { FakeTerminal } from "./compositions/FakeTerminal";
import { CartoonRobot } from "./compositions/CartoonRobot";
import { AwsDiagram } from "./compositions/AwsDiagram";
import { AwsInfraDiagram } from "./compositions/AwsInfraDiagram";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GenerativeArt"
        component={GenerativeArt}
        durationInFrames={180}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="Countdown"
        component={CountdownTimer}
        durationInFrames={600}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="GitHubGraph"
        component={GitHubGraph}
        durationInFrames={180}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="CodeTypewriter"
        component={CodeTypewriter}
        durationInFrames={300}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="BarChartRace"
        component={BarChartRace}
        durationInFrames={280}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="QuoteCard"
        component={QuoteCard}
        durationInFrames={200}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="LowerThirds"
        component={LowerThirds}
        durationInFrames={200}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="AnimatedResume"
        component={AnimatedResume}
        durationInFrames={300}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="YearInReview"
        component={YearInReview}
        durationInFrames={240}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="IntroBumper"
        component={IntroBumper}
        durationInFrames={180}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="MusicVisualizer"
        component={MusicVisualizer}
        durationInFrames={240}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="FakeTerminal"
        component={FakeTerminal}
        durationInFrames={320}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="CartoonRobot"
        component={CartoonRobot}
        durationInFrames={300}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="AwsDiagram"
        component={AwsDiagram}
        durationInFrames={330}
        fps={60}
        width={1280}
        height={720}
      />
      <Composition
        id="AwsInfraDiagram"
        component={AwsInfraDiagram}
        durationInFrames={360}
        fps={60}
        width={1280}
        height={720}
      />
    </>
  );
};
