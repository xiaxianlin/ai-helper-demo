import { Tabs } from "antd";
import { AudioChat } from "./views/AudioChat";
import { LocalPlayerView } from "./views/LocalPlayer";
import { TextChat } from "./views/TextChat";
import { useState } from "react";
import { TextToSpeak } from "./views/TextToSpeak";
import { ASRView } from "./views/ASR";
import { TextTTSChat } from "./views/TextTTSChat";

function App() {
  const [activeKey, setActiveKey] = useState("audio_chat");
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
          label: `语音合成`,
          key: "tts",
          children: <TextToSpeak />,
        },
        {
          label: `语音识别`,
          key: "asr",
          children: <ASRView />,
        },
        {
          label: `文本对话`,
          key: "text_chat",
          children: <TextChat />,
        },
        {
          label: `文本-语音对话`,
          key: "chat_to_tts",
          children: <TextTTSChat />,
        },
        {
          label: `语音聊天室`,
          key: "audio_chat",
          children: <AudioChat />,
        },
      ]}
    />
  );
}

export default App;
