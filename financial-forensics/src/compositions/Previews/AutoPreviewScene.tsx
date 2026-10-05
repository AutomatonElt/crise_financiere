import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

type Props = {
  previewPath: string;
};

export const AutoPreviewScene: React.FC<Props> = ({previewPath}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <iframe
        title="preview-frame"
        src={previewPath}
        style={{width: '100%', height: '100%', border: '0'}}
      />
    </AbsoluteFill>
  );
};

export default AutoPreviewScene;
