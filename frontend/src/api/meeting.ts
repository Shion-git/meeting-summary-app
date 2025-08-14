// src/api/meeting.ts

// ---- ベースURL -----------------
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (window as any).__API_BASE__ ||
    "http://localhost:8000";

// ---- 型 ------------------------------------------------------------
export interface Summary {
    id: number;
    filename: string;
    transcription: string;
    summary: string;
    created_at: string;
}

export interface SummaryOut {
    id: number;
    filename: string;
    transcription: string;
    summary: string;
    created_at: string;
}

export interface ActionItem {
    person: string;
    action: string;
    deadline: string | null;
}

export interface EmotionResponse {
    analysis: string;
}

export interface FactInferenceResponse {
    facts: string[];
    inferences: string[];
}

export interface FullProcessResponse {
    id: number;
    filename: string;
    transcription: string;
    summary: string;
    created_at: string;
    emotion_analysis: string;
    action_items: any[];
    fact_inference: {
    facts: string[];
    inferences: string[];
    };
}

// ---- API 呼び出し --------------------------------------------------

// 履歴取得
export async function fetchMeetingHistory(): Promise<Summary[]> {
    const response = await fetch(`${API_BASE}/meetings/history`);
    if (!response.ok) {
    throw new Error("履歴の取得に失敗しました");
    }
    return response.json();
}

// アップロード＋要約
export async function uploadAndSummarize(file: File): Promise<SummaryOut> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/meetings/upload-and-summarize`, {
    method: "POST",
    body: formData,
    });

    if (!response.ok) {
    throw new Error("アップロードに失敗しました");
    }

    return response.json();
}

// 削除
export async function deleteMeetingFile(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/meetings/delete/${id}`, {
    method: "DELETE",
    });
    if (!response.ok) {
    throw new Error("ファイル削除に失敗しました");
    }
    return response.json();
}

// 再要約
export async function resummarize(text: string): Promise<{ summary: string }> {
    const response = await fetch(`${API_BASE}/meetings/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    });

    if (!response.ok) {
    throw new Error("再要約に失敗しました");
    }

    return response.json();
}

// アクションアイテム抽出
export const extractActionItem = async (text: string): Promise<ActionItem[]> => {
    const res = await fetch(`${API_BASE}/meetings/extract-actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    });
    if (!res.ok) {
    throw new Error("アクションアイテム抽出に失敗しました");
    }
    const data = await res.json();
    return data.actions;
};

// 感情分析
export const analyzeEmotion = async (text: string): Promise<EmotionResponse> => {
    const res = await fetch(`${API_BASE}/meetings/analyze-emotion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    });

    if (!res.ok) {
    throw new Error("感情分析に失敗しました");
    }

    return res.json();
};

// ファクト＆推測
export const analyzeFactInference = async (
    text: string
): Promise<FactInferenceResponse> => {
    const res = await fetch(`${API_BASE}/meetings/fact-inference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    });

    if (!res.ok) {
    throw new Error("ファクト＆推測抽出に失敗しました");
    }

    return res.json();
};

// 一括パイプライン
export async function uploadAndFullProcess(
    file: File
): Promise<FullProcessResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/meetings/full-process`, {
    method: "POST",
    body: formData,
    });

    if (!response.ok) {
    throw new Error("一括処理に失敗しました");
    }

    return response.json();
}
