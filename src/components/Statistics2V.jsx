import { Skeleton, Table, Tag } from "antd";
import { useMemo, useState, useEffect } from "react";
import { getAppData } from "../services/customerApi";
import styles from "./invite.module.scss";

const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "center",
  },
  {
    title: "Referrer Name",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "Referrer Email",
    dataIndex: "referrer",
    key: "referrer",
    align: "center",
  },
  {
    title: "Referral Code",
    dataIndex: "referral_code",
    key: "referral_code",
    align: "center",
  },
  {
    title: "Time Invited",
    dataIndex: "time_added",
    key: "time_added",
    align: "center",
  },

  {
    title: "Accepted Time",
    dataIndex: "accepted_time",
    key: "accepted_time",
    align: "center",
  },
  {
    title: "Signed Up",
    dataIndex: "signed_up",
    key: "signed_up",
    align: "center",
  },
  {
    title: "Upgraded",
    dataIndex: "upgraded",
    key: "upgraded",
    align: "center",
  },
  {
    title: "Reward claimed",
    dataIndex: "reward_claimed",
    key: "reward_claimed",
    align: "center",
  },
  {
    title: "Status",
    key: "status",
    align: "center",
    dataIndex: "status",
    render: (status) => (
      <>
        {(() => {
          let color = "geekblue";
          let text = "";
          if (status === "pending") {
            color = "volcano";
            text = "pending";
          } else if (status === "redeemed") {
            color = "green";
            text = "upgraded";
          }
          return <Tag color={color}>{text}</Tag>;
        })()}
      </>
    ),
  },
];

const NewStatistics = () => {
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchRefs() {
    setLoading(true);
    const clientId = localStorage.getItem("client_id");
    const data = await getAppData({ client_id: clientId });
    setLoading(false);
    setRefs(data.rows);
  }

  const totalUpgraded = useMemo(
    () =>
      refs.reduce((acc, val) => (val.status === "redeemed" ? acc + 1 : acc), 0),
    [refs]
  );
  const totalPendingInvites = useMemo(
    () =>
      refs.reduce((acc, val) => (val.status === "pending" ? acc + 1 : acc), 0),
    [refs]
  );

  useEffect(() => {
    fetchRefs();
  }, []);

  return (
    <div className={styles["referral-shopify_table"]}>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          pagination={false}
          footer={() =>
            `Total Converted Referrals: $${totalUpgraded}; Total Pending Referrals: $${totalPendingInvites}`
          }
          columns={columns}
          dataSource={refs}
          bordered
        />
      )}
    </div>
  );
};

export default NewStatistics;