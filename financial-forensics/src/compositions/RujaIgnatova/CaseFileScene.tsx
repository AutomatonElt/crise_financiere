import React from "react";
import { CaseFile } from "../../components/CaseFile";

export const CaseFileGreenwoodScene: React.FC = () => {
  return (
    <CaseFile
      name="Sebastian Greenwood"
      role="Co-founder, OneCoin"
      charges={[
        "Wire fraud",
        "Securities fraud",
        "Conspiracy to commit money laundering",
      ]}
      sentence="20 years"
      status="Sentenced"
      details="British-Swedish businessman. Previously investigated for BigCoin MLM scheme. Recruited by Ignatova as OneCoin's chief promoter."
      startFrame={15}
    />
  );
};

export const CaseFileMarkScottScene: React.FC = () => {
  return (
    <CaseFile
      name="Mark Scott"
      role="Lawyer & money launderer"
      charges={[
        "Conspiracy to commit money laundering",
        "Conspiracy to commit wire fraud",
        "Bank fraud",
      ]}
      sentence="10 years"
      status="Convicted"
      details="Partner at Locke Lord LLP. Used Fenero Funds to launder approximately $400M for OneCoin through fake investment funds."
      startFrame={15}
    />
  );
};

export const CaseFileKonstantinScene: React.FC = () => {
  return (
    <CaseFile
      name="Konstantin Ignatov"
      role="Ruja's brother & OneCoin CEO"
      charges={[
        "Wire fraud",
        "Conspiracy to commit money laundering",
        "Securities fraud",
      ]}
      sentence="Time served + 3 years"
      status="Cooperating witness"
      details="Took over as CEO after Ruja's disappearance. Arrested at LAX in March 2019. Pleaded guilty and cooperated with federal prosecutors."
      startFrame={15}
    />
  );
};

export const CaseFileArmentaScene: React.FC = () => {
  return (
    <CaseFile
      name="Gilbert Armenta"
      role="OneCoin money launderer"
      charges={[
        "Conspiracy to commit money laundering",
        "Wire fraud",
      ]}
      sentence="5 years"
      status="Pleaded guilty"
      details="Helped move hundreds of millions through shell companies and fake investment funds. Cooperated with DOJ investigation."
      startFrame={15}
    />
  );
};
