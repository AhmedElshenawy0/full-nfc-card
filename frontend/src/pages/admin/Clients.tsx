import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { FiSearch, FiUsers, FiAlertTriangle, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
} from "../../store/apiSlice/AuthSlice";
import Snipper from "../../components/global/Snipper";
import BtnSnipper from "../../components/global/BtnSnipper";
import toast from "react-hot-toast";
import { Card, Client, CustomError, SoldService } from "../../types/types";

// ─── editable field ───────────────────────────────────────────────────────────
const EditInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <input
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: "rgba(255,255,255,0.07)",
      border: "0.5px solid rgba(255,255,255,0.15)",
      borderRadius: 8,
      padding: "5px 10px",
      color: "#fff",
      fontSize: 12,
      width: "100%",
      outline: "none",
      fontFamily: "'DM Sans', sans-serif",
    }}
  />
);

// ─── confirm delete modal ─────────────────────────────────────────────────────
const DeleteModal = ({
  email,
  onConfirm,
  onClose,
}: {
  email: string;
  onConfirm: () => void;
  onClose: () => void;
}) =>
  createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(12,12,16,0.98)",
          borderRadius: 20,
          border: "0.5px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 18px 14px",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "rgba(127,29,29,0.3)",
              border: "0.5px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiAlertTriangle size={14} color="rgba(252,165,165,0.8)" />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Delete Client
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {email}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
          >
            <FiX size={13} />
          </button>
        </div>
        <div style={{ padding: "18px 18px 20px" }}>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
            }}
          >
            This will permanently delete this client and all their data. This
            action cannot be undone.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={onConfirm}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 12,
                border: "0.5px solid rgba(239,68,68,0.3)",
                background: "rgba(127,29,29,0.4)",
                color: "rgba(252,165,165,0.9)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 12,
                border: "0.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );

// ─── client row ───────────────────────────────────────────────────────────────
const ClientRow = ({
  client,
  index,
  isEditing,
  editedData,
  isUpdating,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onChange,
}: any) => (
  <motion.tr
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03, duration: 0.3 }}
    style={{
      borderBottom: "0.5px solid rgba(255,255,255,0.05)",
    }}
  >
    <td
      style={{
        padding: "12px 16px",
        fontSize: 12,
        color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {index + 1}
    </td>

    {isEditing ? (
      <>
        <td style={{ padding: "8px 16px" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <EditInput
              value={editedData.first_name}
              onChange={(v) => onChange("first_name", v)}
            />
            <EditInput
              value={editedData.last_name}
              onChange={(v) => onChange("last_name", v)}
            />
          </div>
        </td>
        <td style={{ padding: "8px 16px" }}>
          <EditInput
            value={editedData.email}
            onChange={(v) => onChange("email", v)}
          />
        </td>
        <td style={{ padding: "8px 16px" }}>
          <EditInput
            value={editedData.phone}
            onChange={(v) => onChange("phone", v)}
          />
        </td>
        <td style={{ padding: "8px 16px" }}>
          <EditInput
            value={editedData.city}
            onChange={(v) => onChange("city", v)}
          />
        </td>
        <td style={{ padding: "8px 16px" }}>
          <EditInput
            value={editedData.job}
            onChange={(v) => onChange("job", v)}
          />
        </td>
        <td
          style={{
            padding: "8px 16px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
          }}
        >
          —
        </td>
        <td
          style={{
            padding: "8px 16px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
          }}
        >
          —
        </td>
        <td
          style={{
            padding: "8px 16px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
          }}
        >
          —
        </td>
      </>
    ) : (
      <>
        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
          <p
            style={{ margin: 0, fontSize: 13, color: "#fff", fontWeight: 500 }}
          >
            {client.first_name} {client.last_name}
          </p>
        </td>
        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {client.email}
          </p>
        </td>
        <td style={{ padding: "12px 16px" }}>
          <p
            style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          >
            {client.phone || "—"}
          </p>
        </td>
        <td style={{ padding: "12px 16px" }}>
          <p
            style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          >
            {client.city || "—"}
          </p>
        </td>
        <td style={{ padding: "12px 16px" }}>
          <p
            style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          >
            {client.job || "—"}
          </p>
        </td>
        <td style={{ padding: "12px 16px" }}>
          <p
            style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          >
            {client.birthday
              ? new Date().getFullYear() -
                new Date(client.birthday).getFullYear()
              : "—"}
          </p>
        </td>
        <td style={{ padding: "12px 16px" }}>
          {client.cards?.length > 0 ? (
            <span
              style={{
                fontSize: 10,
                padding: "3px 10px",
                borderRadius: 10,
                background: "rgba(88,28,135,0.22)",
                color: "#c084fc",
                border: "0.5px solid rgba(192,132,252,0.25)",
                fontFamily: "'DM Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{client.cards.length}</span>
              <span>{client.cards.length === 1 ? "card" : "cards"}</span>
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              —
            </span>
          )}
        </td>
        <td style={{ padding: "12px 16px" }}>
          {client.soldServices?.length > 0 ? (
            <span
              style={{
                fontSize: 10,
                padding: "3px 10px",
                borderRadius: 99,
                background: "rgba(20,83,45,0.22)",
                color: "#4ade80",
                border: "0.5px solid rgba(74,222,128,0.25)",
                fontFamily: "'DM Mono', monospace",

                display: "flex",
                gap: 4,
              }}
            >
              <span> {client.soldServices.length}</span>
              <span>
                {client.soldServices.length === 1 ? "service" : "services"}
              </span>
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              —
            </span>
          )}
        </td>
      </>
    )}

    <td style={{ padding: "12px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {isEditing ? (
          <>
            <button
              onClick={() => onSave(client.email)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(20,83,45,0.35)",
                border: "0.5px solid rgba(74,222,128,0.3)",
                color: "#4ade80",
                cursor: "pointer",
              }}
            >
              {isUpdating ? <BtnSnipper /> : <FaCheck size={11} />}
            </button>
            <button
              onClick={onCancel}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(127,29,29,0.3)",
                border: "0.5px solid rgba(239,68,68,0.25)",
                color: "rgba(252,165,165,0.9)",
                cursor: "pointer",
              }}
            >
              <FaTimes size={11} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onEdit(client)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(30,58,138,0.3)",
              border: "0.5px solid rgba(96,165,250,0.25)",
              color: "rgba(147,197,253,0.9)",
              cursor: "pointer",
            }}
          >
            <FaEdit size={11} />
          </button>
        )}
        <button
          onClick={() => onDelete(client.email)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(127,29,29,0.3)",
            border: "0.5px solid rgba(239,68,68,0.25)",
            color: "rgba(252,165,165,0.9)",
            cursor: "pointer",
          }}
        >
          <FaTrash size={11} />
        </button>
      </div>
    </td>
  </motion.tr>
);

// ─── main ─────────────────────────────────────────────────────────────────────
const Clients = () => {
  const [shouldFetchClients, setShouldFetchClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedClientEmail, setSelectedClientEmail] = useState<string | null>(
    null,
  );
  const [searchFocused, setSearchFocused] = useState(false);

  const { data, isLoading, isError } = useGetAllClientsQuery({
    skip: !shouldFetchClients,
  });

  useEffect(() => {
    setShouldFetchClients(true);
  }, []);

  const [deleting, { isSuccess: isDeleted, isError: deleteError }] =
    useDeleteClientMutation();

  const handleDeleteClient = (email: string) => {
    if (!email) return;
    deleting(email);
  };

  useEffect(() => {
    if (isDeleted) toast.success("Client deleted successfully");
    else if (deleteError) toast.error("Failed to delete client");
  }, [isDeleted, deleteError]);

  const [
    updateClient,
    { data: response, error, isSuccess, isLoading: isUpdating },
  ] = useUpdateClientMutation();
  const customError = error as CustomError;

  useEffect(() => {
    if (isSuccess) toast.success(`${response?.message}`);
    else if (error) toast.error(customError?.data?.message as string);
  }, [error, isSuccess]);

  const filteredClients = data?.clients?.filter((client: any) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.phone?.includes(searchTerm)
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiUsers size={16} color="rgba(255,255,255,0.4)" />
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.3px",
              }}
            >
              Manage Clients
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                marginTop: 1,
              }}
            >
              {filteredClients?.length ?? 0} clients
            </p>
          </div>
        </div>

        {/* search */}
        <div style={{ position: "relative" }}>
          <FiSearch
            size={13}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: searchFocused
                ? "rgba(167,139,250,0.7)"
                : "rgba(255,255,255,0.25)",
              pointerEvents: "none",
              transition: "color 0.2s",
            }}
          />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              padding: "9px 14px 9px 34px",
              borderRadius: 12,
              border: `0.5px solid ${searchFocused ? "rgba(167,139,250,0.45)" : "rgba(255,255,255,0.09)"}`,
              background: searchFocused
                ? "rgba(88,28,135,0.1)"
                : "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 13,
              outline: "none",
              width: 280,
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.2s, background 0.2s",
            }}
          />
        </div>
      </div>

      {/* table */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0",
          }}
        >
          <Snipper />
        </div>
      ) : isError ? (
        <p
          style={{
            textAlign: "center",
            color: "rgba(252,165,165,0.7)",
            padding: "48px 0",
          }}
        >
          Failed to load clients.
        </p>
      ) : filteredClients?.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            padding: "48px 0",
          }}
        >
          No clients found.
        </p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 16,
            border: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                {[
                  "#",
                  "Name",
                  "Email",
                  "Phone",
                  "City",
                  "Job",
                  "Age",
                  "Cards",
                  "Services",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: h === "Actions" ? "center" : "left",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients?.map((client: any, i: number) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  index={i}
                  isEditing={editingClient === client.id}
                  editedData={editedData}
                  isUpdating={isUpdating}
                  onEdit={(c: Client) => {
                    setEditingClient(c.id);
                    setEditedData({ ...c });
                  }}
                  onCancel={() => {
                    setEditingClient(null);
                    setEditedData({});
                  }}
                  onSave={async (email: string) => {
                    if (!editedData?.email) {
                      toast.error("Email is required");
                      return;
                    }
                    try {
                      await updateClient({ data: editedData, email }).unwrap();
                      setEditingClient(null);
                      setEditedData({});
                    } catch {
                      toast.error("Failed to update client");
                    }
                  }}
                  onDelete={(email: string) => {
                    setSelectedClientEmail(email);
                    setShowModal(true);
                  }}
                  onChange={(field: string, value: string) =>
                    setEditedData((prev: any) => ({ ...prev, [field]: value }))
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* delete modal */}
      <AnimatePresence>
        {showModal && selectedClientEmail && (
          <DeleteModal
            email={selectedClientEmail}
            onConfirm={() => {
              handleDeleteClient(selectedClientEmail);
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clients;
