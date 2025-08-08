import React  from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface EmotionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    emotionText: string;
}

const getColor = (text: string): string => {
    if (text.includes("ポジティブ")) return "green";
    if (text.includes("ネガティブ")) return "red";
    return "gray";
};

const EmotionModal: React.FC<EmotionModalProps> = ({
    isOpen,
    onRequestClose,
    emotionText,
}) => {
    const color = getColor(emotionText);

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="感情分析結果"
        style={{
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "500px",
                padding: "20px",
            },
        }}
        >
            <h2>感情分析結果</h2>
            <div style={{
                backgroundColor: color,
                color: "#fff",
                padding: "10px",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                minHeight: "120px",
                }}
                >
                    {emotionText || "結果がありません"}
                    </div>
                    <div style={{ marginTop: "1rem" }}>
            <button 
            onClick={() => {
                navigator.clipboard.writeText(emotionText);
                alert("感情分析結果をコピーしました！");
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
                </div>
        </Modal>
    );
};

export default EmotionModal;