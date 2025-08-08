import React, { useState } from "react";
import { uploadAndFullProcess } from "../api/meeting";
import type { FullProcessResponse } from "../api/meeting";
import {
    Container,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    Chip,
    Divider,
    Box,
} from "@mui/material";

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<FullProcessResponse | null>(null);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            const res = await uploadAndFullProcess(file);
            console.log("★ 一括処理結果:", res);
            setResult(res);
            setError("");
        }   catch (err: any) {
            console.error(err);
            setError(err.message || "アップロードに失敗しました");
        }
    };

    const getEmotionColor = (text: string | undefined) => {
        if (!text) return "default";
        if (!text.includes("ネガティブ")) return "error";
        if (!text.includes("ポジティブ")) return "success";
        return "primary";
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                会議要約アプリ
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <form onSubmit={handleSubmit}>
                    <input
                    type="file"
                    accept=".mp3,.wav,.mp4,.m4a"
                    onChange={handleChange}
                    style={{ marginRight: "1rem" }}
                    />
                    <Button
                    variant="contained"
                    type="submit"
                    disabled={!file}
                    >
                        アップロードして一括処理
                    </Button>
                </form>
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </Paper>

            {result && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        アップロード結果
                    </Typography>

                    <Typography>
                        <strong>ファイル名：</strong>{result.filename}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>要約：</strong> {result.summary}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            感情分析
                        </Typography>
                        <Chip
                        label={result.emotion_analysis || "なし"}
                        color={getEmotionColor(result.emotion_analysis)}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        アクションアイテム
                    </Typography>
                    {result.action_items?.length === 0 ? (
                        <Typography color="text.secondary">なし</Typography>
                    ) : (
                        <List>
                        {result.action_items.map((item, idx) => (
                        <ListItem key={idx}>
                            {item.person} : {item.action}
                            {item.deadline && `(期限: ${item.deadline})`}
                        </ListItem>
                    ))}
                    </List>
                    )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            ファクト
                        </Typography>
                        {result.fact_inference?.facts.length === 0 ? (
                            <Typography color="text.secondary">なし</Typography>
                        ) : (
                            <List>
                                {result.fact_inference?.facts.map((fact, idx) => (
                                    <ListItem key={idx}>✓ {fact}</ListItem>
                                ))}
                            </List>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            推測
                        </Typography>
                        {result.fact_inference?.inferences.length === 0 ? (
                            <Typography color="text.secondary">なし</Typography>
                        ) : (
                            <List>
                                {result.fact_inference?.inferences.map((inf, idx) => (
                                    <ListItem key={idx}>→ {inf}</ListItem>
                                ))}
                            </List>
                        )}
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                        作成日時：{new Date(result.created_at).toLocaleString()}
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default FileUpload;