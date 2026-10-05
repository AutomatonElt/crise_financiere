import React from "react";
import { TextReveal } from "../../components/TextReveal";
import { SqlTable } from "../../components/SqlTable";
import { Flowchart } from "../../components/Flowchart";

// Gap 12:49-13:18 — Montée de tension vers $4B
export const Tension4BScene: React.FC = () => {
  return (
    <TextReveal
      startFrame={10}
      items={[
        { text: "LET'S PUT ACTUAL NUMBERS ON THIS", action: "appear", duration: 40, fontSize: 36, color: "#8B92A8" },
        { text: "LET'S PUT ACTUAL NUMBERS ON THIS", action: "vanish", duration: 15, fontSize: 36, color: "#8B92A8" },
        { text: "$4,000,000,000", action: "appear", duration: 30, fontSize: 48, color: "#F5F5F5" },
        { text: "$4,000,000,000", action: "vanish", duration: 15, fontSize: 48, color: "#F5F5F5" },
      ]}
      finalText={{ text: "$4B", color: "#D4AF37", fontSize: 120 }}
    />
  );
};

// Gap 15:58-16:17 — $5M + apparition "50×"
export const Reward50xScene: React.FC = () => {
  return (
    <TextReveal
      startFrame={10}
      items={[
        { text: "$5,000,000 REWARD", action: "appear", duration: 60, fontSize: 56, color: "#D4AF37" },
        { text: "50× more than most fugitives", action: "appear", duration: 120, fontSize: 32, color: "#8B92A8", subtitle: true },
      ]}
    />
  );
};

// Gap 23:19-23:39 — Mots-clés qui disparaissent → FRAUD
export const StripCryptoScene: React.FC = () => {
  return (
    <TextReveal
      startFrame={10}
      items={[
        { text: "ONECOIN", action: "appear", duration: 15, fontSize: 52, color: "#D4AF37" },
        { text: "ONECOIN", action: "vanish", duration: 10, fontSize: 52, color: "#D4AF37" },
        { text: "CRYPTO", action: "appear", duration: 15, fontSize: 52, color: "#4A9EFF" },
        { text: "CRYPTO", action: "vanish", duration: 10, fontSize: 52, color: "#4A9EFF" },
        { text: "BLOCKCHAIN", action: "appear", duration: 15, fontSize: 52, color: "#2ECC71" },
        { text: "BLOCKCHAIN", action: "vanish", duration: 10, fontSize: 52, color: "#2ECC71" },
        { text: "BITCOIN KILLER", action: "appear", duration: 15, fontSize: 52, color: "#D4AF37" },
        { text: "BITCOIN KILLER", action: "vanish", duration: 10, fontSize: 52, color: "#D4AF37" },
        { text: "STRIP AWAY THE CRYPTO BRANDING", action: "appear", duration: 20, fontSize: 28, color: "#8B92A8", subtitle: true },
        { text: "STRIP AWAY THE CRYPTO BRANDING", action: "vanish", duration: 10, fontSize: 28, color: "#8B92A8", subtitle: true },
      ]}
      finalText={{ text: "FRAUD", color: "#E63946", fontSize: 96 }}
    />
  );
};

// Gap 6:30-6:50 — Base SQL animée
export const SqlTableScene: React.FC = () => {
  return (
    <SqlTable
      startFrame={15}
      backgroundImage="/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/ia-image/08-bjercke-declined-document.png"
    />
  );
};

// Gap 19:04-19:54 — Mini-flowchart Mark Scott
export const FlowchartScene: React.FC = () => {
  return (
    <Flowchart
      startFrame={15}
      backgroundImage="/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/ia-image/13-broll-crowd-arena.png"
    />
  );
};
