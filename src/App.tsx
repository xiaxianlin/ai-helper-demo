import { Tabs } from "antd";
import { AudioChat } from "./views/AudioChat";
import { LocalPlayerView } from "./views/LocalPlayer";
import { TextChat } from "./views/TextChat";
import { useState } from "react";
import { TextToSpeak } from "./views/TextToSpeak";
import { ASRView } from "./views/ASR";

function App() {
  const [activeKey, setActiveKey] = useState("asr");
  return (
    <Tabs
      size="large"
      centered
      activeKey={activeKey}
      type="card"
      onChange={setActiveKey}
      items={[
        {
          label: `本地播放`,
          key: "local_player",
          children: <LocalPlayerView />,
        },
        {
          label: `简单聊天室`,
          key: "text_chat",
          children: <TextChat />,
        },
        {
          label: `语音聊天室`,
          key: "audio_chat",
          children: <AudioChat />,
        },
        {
          label: `语音合成`,
          key: "tts",
          children: <TextToSpeak />,
        },
        {
          label: `语音识别`,
          key: "asr",
          children: <ASRView />,
        },
      ]}
    />
  );
}

export default App;
