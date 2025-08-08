import React from "react";
import Modal from "react-modal"

Modal.setAppElement("#root");

interface ResummaryModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    summaryText: string;
}

const ResummaryModal: React.FC<ResummaryModalProps> = ({
    isOpen,
    onRequestClose,
    summaryText,
}) => {
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="再要約結果"
        style={{
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                transform: "translate(-50%, -50%)",
                width: "600px",
                padding : "20px"
            },
        }}
        >
            <h2>再要約結果</h2>
            <div style={{
                backgroundColor: "#f2f2f2",
                padding: "10px",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                }}
                >
                    {summaryText || "再要約結果がまだありません。"}
                    </div>
                    <button
                    onClick={() => {
                        navigator.clipboard.writeText(summaryText);
                        alert("再要約結果をコピーしました！");
                    }}
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    >
                        コピーする
                    </button>
        </Modal>
    );
};

export default ResummaryModal;