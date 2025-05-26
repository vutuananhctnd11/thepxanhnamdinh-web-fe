import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const { Title } = Typography;

export default function StartSellingTicket() {
  const { matchId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const [tickets, setTickets] = useState({
    standA: [],
    standB: [],
    standC: [],
    standD: [],
  });

  const handleAddTicket = (stand) => {
    const newTicket = {
      id: Date.now(),
      price: null,
      position: "",
      note: "",
      quantity: null,
    };
    setTickets((prev) => ({
      ...prev,
      [stand]: [...prev[stand], newTicket],
    }));
  };

  const handleRemoveTicket = (stand, ticketId) => {
    setTickets((prev) => ({
      ...prev,
      [stand]: prev[stand].filter((t) => t.id !== ticketId),
    }));
  };

  const handleChange = (stand, id, field, value) => {
    setTickets((prev) => ({
      ...prev,
      [stand]: prev[stand].map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  // Render form vé dạng hàng ngang
  const renderTicketsForm = (standKey, standLabel) => (
    <Card
      title={`Khán đài ${standLabel}`}
      style={{ marginBottom: 24 }}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAddTicket(standKey)}
          size="small"
        >
          Thêm vé
        </Button>
      }
    >
      {tickets[standKey].length === 0 && (
        <div style={{ color: "#888" }}>Chưa có vé nào được mở bán.</div>
      )}

      {tickets[standKey].map((ticket) => (
        <div
          key={ticket.id}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Input
            placeholder="Vị trí khán đài"
            value={ticket.position}
            onChange={(e) =>
              handleChange(standKey, ticket.id, "position", e.target.value)
            }
            style={{ flex: 1 }}
          />
          <InputNumber
            placeholder="Giá (VNĐ)"
            value={ticket.price}
            min={0}
            onChange={(value) =>
              handleChange(standKey, ticket.id, "price", value)
            }
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ flex: 2 }}
          />
          <InputNumber
            placeholder="Số lượng"
            value={ticket.quantity}
            min={0}
            onChange={(value) =>
              handleChange(standKey, ticket.id, "quantity", value)
            }
            style={{ flex: 1 }}
          />
          <Input
            placeholder="Ghi chú"
            value={ticket.note}
            onChange={(e) =>
              handleChange(standKey, ticket.id, "note", e.target.value)
            }
            style={{ flex: 3 }}
          />
          <Popconfirm
            title="Xóa vé này?"
            onConfirm={() => handleRemoveTicket(standKey, ticket.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ))}
    </Card>
  );

  const handleSave = async () => {
    const totalTickets = Object.values(tickets).flat().length;
    if (totalTickets === 0) {
      messageApi.error("Vui lòng thêm ít nhất 1 loại vé!");
      return;
    }

    // Chuẩn bị dữ liệu gửi đi (bạn dùng fetch)
    const requestData = {
      matchId: matchId,
      standA: tickets.standA.map(({ price, position, note, quantity }) => ({
        price,
        position,
        note,
        quantity,
      })),
      standB: tickets.standB.map(({ price, position, note, quantity }) => ({
        price,
        position,
        note,
        quantity,
      })),
      standC: tickets.standC.map(({ price, position, note, quantity }) => ({
        price,
        position,
        note,
        quantity,
      })),
      standD: tickets.standD.map(({ price, position, note, quantity }) => ({
        price,
        position,
        note,
        quantity,
      })),
    };

    console.log("Dữ liệu gửi đi:", requestData);

    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches/open-sell-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        messageApi.success({
          content:
            "Mở bán vé thành công! Bạn sẽ được chuyển hướng về danh sách trận đấu sân nhà!",
          duration: 3,
        });
      } else {
        messageApi.error({
          content: "Thao tác thất bại" + response.message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
      className="light-mode"
    >
      {contextHolder}
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Mở bán vé trận đấu
      </Title>

      {renderTicketsForm("standA", "A")}
      {renderTicketsForm("standB", "B")}
      {renderTicketsForm("standC", "C")}
      {renderTicketsForm("standD", "D")}

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Button type="primary" size="large" onClick={handleSave}>
          Lưu danh sách vé
        </Button>
      </div>
    </div>
  );
}
