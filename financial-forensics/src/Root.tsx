import React from "react";
import { Composition } from "remotion";
import { theme } from "./theme";
import { PriceChartScene } from "./compositions/RujaIgnatova/PriceChartScene";
import { MlmPyramidScene } from "./compositions/RujaIgnatova/MlmPyramidScene";
import { MlmPyramidV2Scene } from "./compositions/RujaIgnatova/MlmPyramidV2Scene";
import { MoneyFlowScene } from "./compositions/RujaIgnatova/MoneyFlowScene";
import { RewardStaircaseScene } from "./compositions/RujaIgnatova/RewardStaircaseScene";
import { ComparisonBarsScene } from "./compositions/RujaIgnatova/ComparisonBarsScene";
import { ThreeTheoriesScene } from "./compositions/RujaIgnatova/ThreeTheoriesScene";
import { PackagesTableScene } from "./compositions/RujaIgnatova/PackagesTableScene";
import { BlockchainComparisonScene } from "./compositions/RujaIgnatova/BlockchainComparisonScene";
import { MiningComparisonScene } from "./compositions/RujaIgnatova/MiningComparisonScene";
import { TrustChainScene } from "./compositions/RujaIgnatova/TrustChainScene";
import {
  CaseFileGreenwoodScene,
  CaseFileMarkScottScene,
  CaseFileKonstantinScene,
  CaseFileArmentaScene,
} from "./compositions/RujaIgnatova/CaseFileScene";
import {
  MapRouteSofiaAthensScene,
  MapRouteWorldScene,
  MapRouteSofiaCapeTownScene,
  MapRouteContagionScene,
} from "./compositions/RujaIgnatova/MapRouteScene";
import { StatCounterScene } from "./compositions/RujaIgnatova/StatCounterScene";
import {
  Tension4BScene,
  Reward50xScene,
  StripCryptoScene,
  SqlTableScene,
  FlowchartScene,
} from "./compositions/RujaIgnatova/GapFillScene";
import onecoinPrice from "./data/onecoin-price.json";
import bitcoinPrice from "./data/bitcoin-price.json";
import { EducationalPackagesScene } from "./compositions/RujaIgnatova/EducationalPackagesScene";
import { GlobalExpansionScene } from "./compositions/RujaIgnatova/GlobalExpansionScene";
import { IndictmentScene } from "./compositions/RujaIgnatova/IndictmentScene";
import { DecentralizedNetworkScene } from "./compositions/RujaIgnatova/DecentralizedNetworkScene";
import { OneCoinDatabaseScene } from "./compositions/RujaIgnatova/OneCoinDatabaseScene";
import { NewsImpactScene } from "./compositions/RujaIgnatova/NewsImpactScene";
import { RegulatoryArbitrageScene } from "./compositions/RujaIgnatova/RegulatoryArbitrageScene";
import { TheMechanismScene } from "./compositions/RujaIgnatova/TheMechanismScene";
import { VictimsCounterScene } from "./compositions/RujaIgnatova/VictimsCounterScene";
import { BudgetComparisonScene } from "./compositions/RujaIgnatova/BudgetComparisonScene";
import { MadoffComparisonScene } from "./compositions/RujaIgnatova/MadoffComparisonScene";
import { MlmVsPonziComparisonScene } from "./compositions/RujaIgnatova/MlmVsPonziComparisonScene";
import { RecoveredAssetsScene } from "./compositions/RujaIgnatova/RecoveredAssetsScene";
import { FBIRewardComparisonScene } from "./compositions/RujaIgnatova/FBIRewardComparisonScene";
import { EpilogueTitleScene } from "./compositions/RujaIgnatova/EpilogueTitleScene";
import { EpilogueTimelineScene } from "./compositions/RujaIgnatova/EpilogueTimelineScene";
import { TheoryTitleScene } from "./compositions/RujaIgnatova/TheoryTitleScene";
import { GravitySpectrumScene } from "./compositions/RujaIgnatova/GravitySpectrumScene";
import { FinalClosingScene } from "./compositions/RujaIgnatova/FinalClosingScene";
import { FTXValuationHookScene } from "./compositions/FTX/FTXValuationHookScene";
import { FTXBitcoinScaleScene } from "./compositions/FTX/FTXBitcoinScaleScene";
import { FTXBitcoinRingScene } from "./compositions/FTX/FTXBitcoinRingScene";
import { FTXNineDaysScene } from "./compositions/FTX/FTXNineDaysScene";
import { FTXLarryDavidScene } from "./compositions/FTX/FTXLarryDavidScene";
import { FTXFounderIntroScene } from "./compositions/FTX/FTXFounderIntroScene";
import { TitleCardScene, TitleCardProps } from "./compositions/TitleCard/TitleCardScene";
import { EvidenceCardScene, EvidenceCardProps } from "./compositions/EvidenceCard/EvidenceCardScene";
import { ChapterCardScene, ChapterCardProps } from "./compositions/ChapterCard/ChapterCardScene";
import { MainTitleScene, MainTitleProps } from "./compositions/MainTitle/MainTitleScene";
import { SubscribeCTAScene, SubscribeCTAProps } from "./compositions/SubscribeCTA/SubscribeCTAScene";
import { RujaPrestigeGalleryScene } from "./compositions/RujaIgnatova/RujaPrestigeGalleryScene";
import { MagazinePosterScene, MagazinePosterProps } from "./compositions/MagazinePoster/MagazinePosterScene";
import {
  Forensic3DDocumentScene,
  Forensic3DDocumentProps,
} from "./compositions/Forensic3DDocument/Forensic3DDocumentScene";
import { DocumentEvidenceScene, DocumentEvidenceProps } from "./compositions/DocumentEvidence/DocumentEvidenceScene";
import { StatusStampScene, StatusStampProps } from "./compositions/StatusStamp/StatusStampScene";
import { LedgerTitleCardScene, LedgerTitleCardProps } from "./compositions/LedgerTitleCard/LedgerTitleCardScene";
import {
  LedgerTitleSequenceScene,
  LedgerTitleSequenceProps,
} from "./compositions/LedgerTitleSequence/LedgerTitleSequenceScene";
import { LocationCardScene, LocationCardProps } from "./compositions/LocationCard/LocationCardScene";
import { Design1HiggsfieldScene } from "./compositions/Design1Higgsfield/Design1HiggsfieldScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Design1Higgsfield"
        component={Design1HiggsfieldScene}
        durationInFrames={228}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="Forensic3DDocument"
        component={Forensic3DDocumentScene as any}
        durationInFrames={150}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 150,
          };
        }}
        defaultProps={{
          imageSrc: "gallery_financial_it_perfect.jpeg",
          documentTitle: "SDNY EVIDENCE EXHIBIT",
          aspectRatio: 16 / 9,
          transparent: false,
        }}
      />
      <Composition
        id="MagazinePoster"
        component={MagazinePosterScene as any}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 125,
          };
        }}
        defaultProps={{
          imageSrc: "gallery_financial_it_perfect.jpeg",
          title: "FINANCIAL IT MAGAZINE",
          coverPosition: "center center",
          cardWidth: 1250,
          showTitle: false,
        }}
      />
      <Composition
        id="PosterFinancialIT"
        component={MagazinePosterScene as any}
        durationInFrames={200}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          imageSrc: "gallery_financial_it_perfect.jpeg",
          title: "FINANCIAL IT MAGAZINE",
          coverPosition: "center center",
          cardWidth: 1250,
          showTitle: false,
        }}
      />
      <Composition
        id="PosterForbesBulgaria"
        component={MagazinePosterScene as any}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          imageSrc: "gallery_ruja_forbes_perfect.jpeg",
          title: "FORBES BULGARIA",
          coverPosition: "center center",
          cardWidth: 1250,
          showTitle: false,
        }}
      />
      <Composition
        id="RujaPrestigeGallery"
        component={RujaPrestigeGalleryScene}
        durationInFrames={150}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubscribeCTA"
        component={SubscribeCTAScene}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 125,
          };
        }}
        defaultProps={{
          theme: "classic-red",
          subscribeText: "SUBSCRIBE",
          subscribedText: "SUBSCRIBED",
          position: "bottom-center",
          scale: 1.0,
        }}
      />
      <Composition
        id="MainTitle"
        component={MainTitleScene as any}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 125,
          };
        }}
        defaultProps={{
          seriesTag: "FINANCIAL FORENSICS // CASE FILE 01",
          title: "THE CRYPTOQUEEN",
          subtitle: "THE $4 BILLION DISAPPEARANCE",
          accentColor: "#D4AF37",
          glowColor: "#F59E0B",
          bgType: "dark",
        }}
      />
      <Composition
        id="ChapterCard"
        component={ChapterCardScene as any}
        durationInFrames={120}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 120,
          };
        }}
        defaultProps={{
          number: "01",
          title: "THE WOMAN WHO VANISHED WITH $4 BILLION",
          subtitle: "THE DISAPPEARANCE OF RUJA IGNATOVA",
          position: "left",
          accentColor1: "#D4AF37",
          accentColor2: "#E11D48",
          titleColor: "#F8FAFC",
          subtitleColor: "#94A3B8",
          lineWidth: 620,
        }}
      />
      <Composition
        id="EvidenceCard"
        component={EvidenceCardScene as any}
        durationInFrames={150}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 150,
          };
        }}
        defaultProps={{
          imageSrc: "",
          position: "right",
          frameStyle: "clean",
          cardWidth: 520,
          offsetY: 85,
        }}
      />
      <Composition
        id="LocationCard"
        component={LocationCardScene as any}
        durationInFrames={75}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 75,
          };
        }}
        defaultProps={{
          imageSrc: "REAL-04_ftx_arena_miami_nuit.jpg",
          title: "FTX ARENA",
          subtitle: "",
          dateOrBadge: "",
          cardStyle: "postcard",
          position: "right",
          cardWidth: 440,
          tiltDeg: 1.2,
          offsetY: 40,
        }}
      />
      <Composition
        id="TitleCard"
        component={TitleCardScene as any}
        durationInFrames={165}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 165,
          };
        }}
        defaultProps={{
          line1: "OCTOBRE 2017",
          line2: "SOFIA — ATHÈNES",
          startFrameLine1: 8,
          startFrameLine2: 44,
          charsPerSecond: 14,
          colorLine1: "#38BDF8",
          colorLine2: "#E0F2FE",
          position: "bottom-left",
        }}
      />
      <Composition
        id="DocumentEvidence"
        component={DocumentEvidenceScene as any}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 125,
          };
        }}
        defaultProps={{
          header: "EXHIBIT B — INTERNAL MEMO",
          classification: "CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE",
          date: "OCTOBER 20, 2014 — 14:32 UTC",
          sender: "ruja.ignatova@onecoin.eu",
          recipient: "sebastian.greenwood@onecoin.eu",
          subject: "Strategy update regarding token emission",
          bodyText: "We are not mining coins. The members believe there is a blockchain, but everything is entered into a SQL database. If things go bad, we take the money and run and blame someone else.",
          targetPhrase: "take the money and run and blame someone else",
          mode: "highlight",
          highlightColor: "#EAB308",
          styleMode: "dark_legal",
        }}
      />
      <Composition
        id="StatusStamp"
        component={StatusStampScene as any}
        durationInFrames={90}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 90,
          };
        }}
        defaultProps={{
          text: "ARRESTED",
          subText: "25 OCT 2017 // SDNY",
          color: "red",
          rotation: -12,
          impactFrame: 10,
          size: "medium",
          isOverlay: true,
        }}
      />
      <Composition
        id="LedgerTitleCard"
        component={LedgerTitleCardScene as any}
        durationInFrames={150}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 150,
          };
        }}
        defaultProps={{
          channelName: "THE LEDGER",
          caseNumber: "DOSSIER #1976-NC",
          title: "LE CASSE DU SIÈCLE",
          subtitle: "NICE • JUILLET 1976",
          handwrittenNote1: "Sans armes, sans haine, sans violence...",
          handwrittenNote2: "le coffre de la Société Générale",
          handwrittenNote3: "weekend du 14 juillet — 80m de tunnel",
          themeMode: "archival_paper",
          stampText: "LEDGER VERIFIED",
        }}
      />
      <Composition
        id="LedgerTitleSequence"
        component={LedgerTitleSequenceScene as any}
        durationInFrames={160}
        fps={25}
        width={1920}
        height={1080}
        calculateMetadata={({ props }: { props: any }) => {
          return {
            durationInFrames: props?.durationInFrames || 160,
          };
        }}
        defaultProps={{
          frame1Image: "brand/frame1_ninedays.jpg",
          frame2Image: "brand/frame2_sbf.jpg",
          frame3Image: "brand/frame3_billboard.jpg",
        }}
      />
      <Composition
        id="FTXValuationHook"
        component={FTXValuationHookScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FTXBitcoinScale"
        component={FTXBitcoinScaleScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FTXBitcoinRing"
        component={FTXBitcoinRingScene}
        durationInFrames={480}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FTXNineDays"
        component={FTXNineDaysScene}
        durationInFrames={480}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FTXLarryDavid"
        component={FTXLarryDavidScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FTXFounderIntro"
        component={FTXFounderIntroScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
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
        durationInFrames={360}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MlmPyramidV2"
        component={MlmPyramidV2Scene}
        durationInFrames={360}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
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
      <Composition
        id="CaseFileGreenwood"
        component={CaseFileGreenwoodScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="CaseFileMarkScott"
        component={CaseFileMarkScottScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="CaseFileKonstantin"
        component={CaseFileKonstantinScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="CaseFileArmenta"
        component={CaseFileArmentaScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MapRouteSofiaAthens"
        component={MapRouteSofiaAthensScene}
        durationInFrames={240}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MapRouteWorld"
        component={MapRouteWorldScene}
        durationInFrames={300}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="MapRouteSofiaCapeTown"
        component={MapRouteSofiaCapeTownScene}
        durationInFrames={270}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="StatCounter4B"
        component={StatCounterScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="Tension4B"
        component={Tension4BScene}
        durationInFrames={120}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="Reward50x"
        component={Reward50xScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="StripCrypto"
        component={StripCryptoScene}
        durationInFrames={150}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="SqlTable"
        component={SqlTableScene}
        durationInFrames={150}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="FlowchartMarkScott"
        component={FlowchartScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
        defaultProps={{} as any}
      />
      <Composition
        id="EducationalPackages"
        component={EducationalPackagesScene}
        durationInFrames={600}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="MapRouteContagion"
        component={MapRouteContagionScene}
        durationInFrames={360}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="GlobalExpansion"
        component={GlobalExpansionScene}
        durationInFrames={390}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="Indictment"
        component={IndictmentScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="DecentralizedNetwork"
        component={DecentralizedNetworkScene}
        durationInFrames={240}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="OneCoinDatabase"
        component={OneCoinDatabaseScene}
        durationInFrames={360}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="NewsImpact"
        component={NewsImpactScene}
        durationInFrames={280}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="RegulatoryArbitrage"
        component={RegulatoryArbitrageScene}
        durationInFrames={450}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="TheMechanism"
        component={TheMechanismScene}
        durationInFrames={750}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="VictimsCounter"
        component={VictimsCounterScene}
        durationInFrames={600}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="BudgetComparison"
        component={BudgetComparisonScene}
        durationInFrames={450}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="MadoffComparison"
        component={MadoffComparisonScene}
        durationInFrames={480}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="MlmVsPonziComparison"
        component={MlmVsPonziComparisonScene}
        durationInFrames={400}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="RecoveredAssets"
        component={RecoveredAssetsScene}
        durationInFrames={400}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="FBIReward"
        component={FBIRewardComparisonScene}
        durationInFrames={450}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="EpilogueTitle"
        component={EpilogueTitleScene}
        durationInFrames={180}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="EpilogueTimeline"
        component={EpilogueTimelineScene}
        durationInFrames={540}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />

      <Composition
        id="TheoryOneTitle"
        component={TheoryTitleScene}
        durationInFrames={125}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          theoryNumber: "",
          theoryText: "Theorie 1   :  She's dead.",
        }}
      />
      <Composition
        id="TheoryTwoTitle"
        component={TheoryTitleScene}
        durationInFrames={175}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          theoryNumber: "",
          theoryText: "Theorie 2   :  She's alive, hiding under organized crime protection.",
        }}
      />
      <Composition
        id="TheoryThreeTitle"
        component={TheoryTitleScene}
        durationInFrames={225}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          theoryNumber: "",
          theoryText: "Theorie 3   :  She's alive, and building a new life (Leading theory).",
        }}
      />
      <Composition
        id="GravitySpectrum"
        component={GravitySpectrumScene}
        durationInFrames={540}
        fps={theme.animation.fps}
        width={theme.animation.width}
        height={theme.animation.height}
      />
      <Composition
        id="FinalClosing"
        component={FinalClosingScene}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
