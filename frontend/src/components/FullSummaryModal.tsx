import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface FullSummaryModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    summaryText: string;
}

const FullSummaryModal:React.FC<FullSummaryModalProps> = ({
    isOpen,
    onRequestClose,
    summaryText,
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(summaryText);
        alert("全文要約コピーしました！");
    };

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="全文要約"
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
            <h2>要約全文</h2>
            <div
            style={{
                backgroundColor: "#f2f2f2",
                padding: "10px",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                marginBottom: "1rem",
                maxHeight: "400px",
                overflowY: "auto",
            }}
            >
                {summaryText || "要約はまだありません。"}
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

export default FullSummaryModal;