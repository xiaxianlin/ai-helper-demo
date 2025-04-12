import { useState } from "react";
import { Tabs } from "antd";
import { Chat } from "./pages/chat";
import { TextToSpeak } from "./components/TextToSpeak";

function App() {
  const [activeKey, setActiveKey] = useState("chat");
  return (
    <Tabs
      size="large"
      centered
      activeKey={activeKey}
      type="card"
      onChange={setActiveKey}
      items={[
        { label: `语音聊天`, key: "chat", children: <Chat /> },
        { label: `语音合成`, key: "tts", children: <TextToSpeak /> },
      ]}
    />
  );
}

export default App;
