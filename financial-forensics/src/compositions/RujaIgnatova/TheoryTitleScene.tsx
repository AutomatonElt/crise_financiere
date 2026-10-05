import React from "react";
import { TitleCardScene } from "../TitleCard/TitleCardScene";

export const TheoryTitleScene: React.FC<{
    theoryNumber?: string;
    theoryText: string;
}> = ({ theoryText }) => {
    return (
        <TitleCardScene
            line1={theoryText}
            line2=""
            position="center"
            colorLine1="#38BDF8"
            charsPerSecond={14}
        />
    );
};

