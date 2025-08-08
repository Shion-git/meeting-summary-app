// APIレスポンスの型
export interface Summary {
    id: number;
    filename: string;
    transcription: string;
    summary: string;
    created_at: string;
}

// 履歴取得APIを呼び出す関数
export async function fetchMeetingHistory(): Promise<Summary[]> {
    const response = await fetch("http://127.0.0.1:8000/meetings/history");
    if (!response.ok) {
        throw new Error("履歴の取得に失敗しました");
    }
    return response.json();
}

export interface SummaryOut {
    id: number;
    filename: string;
    transcription: string;
    summary: string;
    created_at: string;
}

// uploadAndSummarize 関数
export async function uploadAndSummarize(file: File): Promise<SummaryOut> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/meetings/upload-and-summarize", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("アップロードに失敗しました");
    }

    return response.json();
}

// アップロードしたファイル削除関数を呼び出す
export async function deleteMeetingFile(id: number): Promise<{ message: string }> {
    const response = await fetch(`http://127.0.0.1:8000/meetings/delete/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("ファイル削除に失敗しました");
    }
    return response.json();
}

// 再要約機能
export async function resummarize(text: string): Promise<{ summary: string }> {
    const response = await fetch("http://127.0.0.1:8000/meetings/summarize", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            text: text,
        }),
    });

    if (!response.ok) {
        throw new Error("再要約に失敗しました");
    }

    return response.json();
}

export interface ActionItem {
    person: string;
    action: string;
    deadline: string | null;
}

// アクションアイテム関数
export const extractActionItem = async (text: string): Promise<ActionItem[]> => {
    const res = await fetch("http://127.0.0.1:8000/meetings/extract-actions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) {
        throw new Error("アクションアイテム抽出に失敗しました");
    }
    const data = await res.json();
    return data.actions;
};

export interface EmotionResponse {
    analysis: string;
}

// 感情分析関数
export const analyzeEmotion = async (text: string): Promise<EmotionResponse> => {
    const res = await fetch("http://127.0.0.1:8000/meetings/analyze-emotion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        throw new Error("感情分析に失敗しました");
    }

    const data = await res.json();
    return data;
};

export interface FactInferenceResponse {
    facts: string[];
    inferences: string[];
}

export const analyzeFactInference = async (
    text: string
): Promise<FactInferenceResponse> => {
    const res = await fetch(
        "http://127.0.0.1:8000/meetings/fact-inference",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        }
    );

    if (!res.ok) {
        throw new Error("ファクト＆推測抽出に失敗しました");
    }

    return res.json();
};

// 一括パイプライン
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

export async function uploadAndFullProcess(file: File): Promise<FullProcessResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/meetings/full-process", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("一括処理に失敗しました");
    }

    return response.json();
}