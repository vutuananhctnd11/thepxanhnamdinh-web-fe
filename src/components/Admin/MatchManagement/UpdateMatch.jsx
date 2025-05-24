import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Card,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const UpdateMatch = () => {
  const { matchId } = useParams();
  const [form] = Form.useForm();
  const [clubs, setClubs] = useState([]);
  const [match, setMatch] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  //get option in select
  const fetchClubs = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/clubs/list-to-fill`
      );
      const response = await res.json();

      if (response.status === "success") {
        setClubs(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi fetch CLB:", err);
    }
  };

  const fetchMatchInfo = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches/${matchId}`
      );
      const response = await res.json();

      if (response.status === "success") {
        setMatch(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi fetch CLB:", err);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchMatchInfo();
  }, [matchId]);

  useEffect(() => {
    if (match) {
      form.setFieldsValue({
        clubId: match.clubId,
        isHome: match.isHome,
        matchDate: dayjs(match.matchDate),
        tournament: match.tournament,
        round: match.round,
      });
    }
  }, [match]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      matchId: matchId,
      matchDate: values.matchDate.format("YYYY-MM-DDTHH:mm:ss"),
    };
    console.log("Dữ liệu gửi:", payload);

    // fetch update match
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        form.resetFields();
        messageApi.success({
          content: "Cập nhật lịch thi đấu thành công!",
          duration: 3,
        });
        setMatch(response.data);
      } else {
        messageApi.error({
          content: response.message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <div className="light-mode">
      {contextHolder}
      <Card
        title="Thêm lịch thi đấu"
        style={{
          maxWidth: 900,
          margin: "2rem auto",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "red",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isHome: false,
          }}
        >
          <Form.Item
            label="Thi đấu trên sân nhà?"
            name="isHome"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Câu lạc bộ đối thủ"
                name="clubId"
                rules={[{ required: true, message: "Chọn CLB" }]}
              >
                <Select
                  placeholder="Chọn CLB"
                  popupClassName="light-mode-dropdown"
                  className="light-mode"
                >
                  {clubs.map((club) => (
                    <Option key={club.clubId} value={club.clubId}>
                      {club.clubName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời gian thi đấu"
                name="matchDate"
                rules={[{ required: true, message: "Chọn thời gian thi đấu" }]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giải đấu"
                name="tournament"
                rules={[{ required: true, message: "Nhập giải đấu" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vòng đấu"
                name="round"
                rules={[{ required: true, message: "Nhập vòng đấu" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            style={{ textAlign: "right", marginBottom: 0, marginTop: "20px" }}
          >
            <Button
              type="default"
              htmlType="button"
              style={{ marginRight: "20px" }}
              onClick={() => navigate("/admin/list-match")}
            >
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateMatch;
