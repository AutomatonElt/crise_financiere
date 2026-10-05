import React from "react";
import { StatCounter } from "../../components/StatCounter";

export const StatCounterScene: React.FC = () => {
  return (
    <StatCounter
      targetValue={4}
      prefix="$"
      suffix="B"
      label="Total stolen"
      sublabel="More than most countries' national budgets"
      decimals={1}
      startFrame={15}
    />
  );
};
