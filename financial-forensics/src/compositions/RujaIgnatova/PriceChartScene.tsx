import React from "react";
import { PriceChart } from "../../components/PriceChart";

type PricePoint = {
  date: string;
  price: number;
  label?: string;
};

type PriceChartSceneProps = {
  series1: PricePoint[];
  series2: PricePoint[];
  series1Name: string;
  series2Name: string;
  series1Color: string;
  series2Color: string;
  title: string;
  subtitle?: string;
};

export const PriceChartScene: React.FC<PriceChartSceneProps> = (props) => {
  return <PriceChart {...props} startFrame={15} drawDurationFrames={120} />;
};
