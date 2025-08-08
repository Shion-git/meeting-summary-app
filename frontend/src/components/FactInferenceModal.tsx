import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface FactInferenceModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    facts: string[];
    inferences: string[];
}

const FactInferenceModal: React.FC<FactInferenceModalProps> = ({
    isOpen,
    onRequestClose,
    facts,
    inferences,
}) => {
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="ファクト＆推測要約"
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
            <h2>ファクト＆推測 要約結果</h2>

            <h3>■ ファクト</h3>
            {facts.length > 0 ? (
                <ul>
                    {facts.map((fact, index) => (
                        <li key={index}>✔ {fact}</li>
                    ))}
                </ul>
            ) : (
                <p>ファクトは見つかりませんでした。</p>
            )}

            <h3 style={{ marginTop: "20px" }}>■ 推測</h3>
            {inferences.length > 0 ? (
                <ul>
                    {inferences.map((inf, index) => (
                        <li key={index} style={{ color: "orange" }}>
                            ✦ {inf}
                        </li>
                    ))}
                </ul>
            ): (
                <p>推測は見つかりませんでした。</p>
            )}

            <button
            onClick={onRequestClose}
            style={{
                marginTop: "20px",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
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

export default FactInferenceModal;