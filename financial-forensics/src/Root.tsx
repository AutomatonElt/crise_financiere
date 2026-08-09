import React from "react";
import { Composition } from "remotion";
import { theme } from "./theme";
import { PriceChartScene } from "./compositions/RujaIgnatova/PriceChartScene";
import { MlmPyramidScene } from "./compositions/RujaIgnatova/MlmPyramidScene";
import { MoneyFlowScene } from "./compositions/RujaIgnatova/MoneyFlowScene";
import { RewardStaircaseScene } from "./compositions/RujaIgnatova/RewardStaircaseScene";
import { ComparisonBarsScene } from "./compositions/RujaIgnatova/ComparisonBarsScene";
import { ThreeTheoriesScene } from "./compositions/RujaIgnatova/ThreeTheoriesScene";
import { PackagesTableScene } from "./compositions/RujaIgnatova/PackagesTableScene";
import { BlockchainComparisonScene } from "./compositions/RujaIgnatova/BlockchainComparisonScene";
import { MiningComparisonScene } from "./compositions/RujaIgnatova/MiningComparisonScene";
import { TrustChainScene } from "./compositions/RujaIgnatova/TrustChainScene";
import onecoinPrice from "./data/onecoin-price.json";
import bitcoinPrice from "./data/bitcoin-price.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OneCoinVsBitcoin"
        component={PriceChartScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{
          series1: onecoinPrice,
          series2: bitcoinPrice,
          series1Name: "OneCoin (company-set price)",
          series2Name: "Bitcoin (real market price)",
          series1Color: theme.colors.gold,
          series2Color: theme.colors.blue,
          title: "OneCoin vs Bitcoin — Price History",
          subtitle: "2014 – 2017 | OneCoin price announced by OneCoin. Bitcoin price set by the market.",
        }}
      />
      <Composition
        id="MlmPyramid"
        component={MlmPyramidScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MoneyFlow"
        component={MoneyFlowScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="RewardStaircase"
        component={RewardStaircaseScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="ComparisonBars"
        component={ComparisonBarsScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="ThreeTheories"
        component={ThreeTheoriesScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="PackagesTable"
        component={PackagesTableScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="BlockchainComparison"
        component={BlockchainComparisonScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MiningComparison"
        component={MiningComparisonScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="TrustChain"
        component={TrustChainScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
    </>
  );
};
