import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Flex, Input, List, message } from "antd";
import { useWebsocket } from "../hooks/useWebsocket";
import { SendOutlined } from "@ant-design/icons";
import markdownit from "markdown-it";

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

type Result = {
  status: "run" | "done";
  content?: string;
};

const SYSTEM_PROMPT = `
# 角色
你是一个极具亲和力的智能情感陪伴体，通过语音与用户展开情感交流，为用户提供温暖且贴心的陪伴。

## 技能
### 技能 1: 语音情感聊天
1. 以柔和、亲切的语音风格与用户聊天，主动引导话题，了解用户当下的情绪状态。
2. 运用丰富的情感表达词汇和语气，让交流充满温度。

### 技能 2: 给予温暖陪伴
1. 当用户表达负面情绪时，迅速给予安慰和鼓励，分享积极乐观的观点和事例。
2. 当用户分享快乐时，积极回应，共同沉浸在喜悦氛围中，强化积极情感体验。

## 限制
- 仅围绕情感聊天和温暖陪伴展开交流，拒绝回答与该主题无关的话题。
- 交流必须通过语音形式进行。
- 始终保持温暖、积极的态度，不得传递负面情绪。 
`;

const md = markdownit({ html: true, breaks: true });
function Conversation({ message }: { message: Message }) {
  return (
    <Flex style={{ flex: 1 }} justify={message.role === "user" ? "flex-end" : "flex-start"}>
      <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }}></div>
    </Flex>
  );
}

export function TextChat() {
  const domRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState("");
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<Result>();
  const { conn, socket, connect, disconnect } = useWebsocket("ws://127.0.0.1:8000/ai/llm", {
    onMessage: (data) => {
      try {
        const json = JSON.parse(data);
        setResult((prev) => ({ ...json, content: (prev?.content || "") + (json.content || "") }));
      } catch (e) {
        message.error("数据解析异常");
      }
    },
  });

  const send = () => {
    const data: Message[] = [...messages, { role: "user", content: value }];
    socket?.send(JSON.stringify([{ role: "system", content: SYSTEM_PROMPT }, ...data]));
    setValue("");
    setMessages(data);
    setRunning(true);
  };

  const data = useMemo(() => {
    return [...messages, ...(result ? [{ role: "assistant", content: result?.content! }] : [])] as Message[];
  }, [messages, result]);

  useEffect(() => {
    if (result?.status !== "done") return;
    setResult(undefined);
    setMessages([...messages, { role: "assistant", content: result?.content! }]);
    setRunning(false);
  }, [result]);

  useEffect(() => {
    domRef.current && (domRef.current.scrollTop = domRef.current.scrollHeight);
  }, [data]);

  return (
    <div className="container">
      <Flex vertical gap={24}>
        <Button type="primary" size="large" onClick={conn ? disconnect : connect}>
          {conn ? "断开连接" : "连接服务器"}
        </Button>
        <div style={{ height: 600, background: "#eee", overflowX: "hidden", scrollBehavior: "smooth" }} ref={domRef}>
          <List
            size="small"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Conversation message={item} />
              </List.Item>
            )}
          />
        </div>
        <Input
          size="large"
          value={value}
          placeholder="请输入"
          disabled={!conn || running}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={send}
          suffix={<SendOutlined />}
        />
      </Flex>
    </div>
  );
}
