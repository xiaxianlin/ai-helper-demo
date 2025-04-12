import { Button, Flex, Spin, Typography } from "antd";
import { useModel } from "./useModel";

export const Chat = () => {
  const {
    contextHolder,
    refs: { canvasRef },
    state: { ready, loading, connecting, recording, result },
    toggleConnect,
    toggleRecord,
  } = useModel();

  return (
    <div className="container">
      {contextHolder}
      <Spin spinning={loading} tip="Loading...">
        <Flex vertical gap={12}>
          <Typography.Paragraph>{result}</Typography.Paragraph>
          <canvas ref={canvasRef} width={600} height={300} style={{ backgroundColor: "#eee" }} />
          <Flex gap={12}>
            <Button style={{ flex: 1 }} type="primary" size="large" onClick={toggleConnect}>
              {connecting ? "断开服务器" : "连接服务器"}
            </Button>
            <Button
              style={{ flex: 1 }}
              disabled={!ready}
              size="large"
              color="cyan"
              variant="solid"
              onClick={toggleRecord}
            >
              {recording ? "停止说话" : "开始说话"}
            </Button>
          </Flex>
        </Flex>
      </Spin>
    </div>
  );
};
