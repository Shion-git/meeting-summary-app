import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface ActionItem {
    person: string;
    action: string;
    deadline: string | null;
}

interface ActionItemsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    items: ActionItem[];
}

const ActionItemsModal: React.FC<ActionItemsModalProps> = ({
    isOpen,
    onRequestClose,
    items,
}) => {
  // コピー用テキスト生成
    const getCopyText = (): string => {
    if (items.length === 0) {
        return "アクションアイテムは見つかりませんでした。";
    } else {
        return items
        .map(
            (item) =>
            `● ${item.person}: ${item.action}${
                item.deadline ? ` (期限: ${item.deadline})` : ""
            }`
        )
        .join("\n");
    }
    };

    const handleCopy = () => {
    const text = getCopyText();
    navigator.clipboard.writeText(text);
    alert("アクションアイテムをコピーしました！");
    };

    return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="アクションアイテム抽出結果"
        style={{
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "600px",
            padding: "20px",
        },
        }}
    >
        <h2>アクションアイテム抽出結果</h2>
        <div
        style={{
            backgroundColor: "#f2f2f2",
            padding: "10px",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
            marginBottom: "1rem",
        }}
        >
        {items.length === 0 ? (
            <p>アクションアイテムは見つかりませんでした。</p>
        ) : (
            <ul>
            {items.map((item, index) => (
                <li key={index}>
                ● <strong>{item.person}</strong> : {item.action}
                {item.deadline &&
                item.deadline.trim() !== "" &&
                item.deadline !== "null" &&
                /^\d{4}-\d{2}-\d{2}$/.test(item.deadline) && (
                    <>(期限: {item.deadline}) </>
                )}
                </li>
            ))}
            </ul>
        )}
        </div>
        <button
        onClick={handleCopy}
        style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "1rem",
        }}
        >
        コピーする
        </button>
        <button
        onClick={onRequestClose}
        style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        }}
        >
        閉じる
        </button>
    </Modal>
    );
};

export default ActionItemsModal;
