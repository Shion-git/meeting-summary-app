import React, { useEffect, useState } from "react";
import FullSummaryModal from "./FullSummaryModal";
import EmotionModal  from "./EmotionModal";
import ResummaryModal from "./ResummaryModal";
import ActionItemsModal from "./ActionItemsModal";
import FactInferenceModal from "./FactInferenceModal";
import { 
    analyzeEmotion, 
    extractActionItem, 
    deleteMeetingFile, 
    fetchMeetingHistory, 
    resummarize, 
    analyzeFactInference,
} from "../api/meeting";
import type { Summary, ActionItem } from "../api/meeting";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";


const SummaryList: React.FC = () => {
    const [FactInferenceModalOpen, setFactInferenceModalOpen] = useState(false);
    const [facts, setFacts] = useState<string[]>([]);
    const [inferences, setInferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [fullSummaryModalOpen, setFullSummaryModalOpen] = useState(false);
    const [fullSummaryText, setFullSummaryText] = useState("");
    const [actionItemsModalOpen, setActionItemsModalOpen] = useState(false);
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [resummaryModalOpen, setResummaryModalOpen] = useState(false);
    const [resummaryText, setResummaryText] = useState("");
    const [emotionModalOpen, setEmotionModalOpen] = useState(false);
    const [emotionText, setEmotionText] = useState("");
    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const openFullSummaryModal = (summary: string) => {
        setFullSummaryText(summary);
        setFullSummaryModalOpen(true);
    };

    const openEmotionModal = (text: string) => {
        setEmotionText(text);
        setEmotionModalOpen(true);
    };

    const closeEmotionModal = () => {
        setEmotionModalOpen(false);
    };

    const loadSummaries = async () => {
        try {
            const data = await fetchMeetingHistory();
            setSummaries(data);
            setError("");
        } catch (err: any) {
            setError(err.message || "履歴の取得に失敗しました");
        }
    };

    useEffect(() => {
        loadSummaries();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("このファイルを削除しますか？")) {
        try {
            await deleteMeetingFile(id);
            await loadSummaries();
        } catch (err: any) {
            setError(err.message || "削除に失敗しました");
            }
        }
    };

    const downloadSummary = (summary: Summary) => {
        const blob = new Blob(
            [`【ファイル名】${summary.filename}\n\n【要約】\n${summary.summary}`],
            { type: "text/plain;charset=utf-8" }
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = summary.filename.replace(/\.[^.]+$/, "") + ".txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleResummarize = async (transcription: string) => {
        setLoading(true);
        setLoadingMessage("再要約中です...");
        try {
            const res = await resummarize(transcription);
            setResummaryText(res.summary);
            setResummaryModalOpen(true); 
        } catch (e: any) {
            alert(e.message || "再要約に失敗しました");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleExtractActions = async (transcription: string) => {
        setLoading(true);
        setLoadingMessage("アクションアイテム抽出中です...");
        try {
            const actions = await extractActionItem(transcription);
            setActionItems(actions);
            setActionItemsModalOpen(true);
        } catch (e: any) {
            alert(e.message || "アクションアイテム抽出に失敗しました");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleAnalyzeEmotion = async (transcription: string) => {
        console.log("送信する transcription:", transcription);
        setLoading(true);
        setLoadingMessage("感情分析中です...");
        try {
            const res = await analyzeEmotion(transcription);
            console.log("感情分析のレスポンス:", res);
            openEmotionModal(res.analysis);
        } catch (e: any) {
            alert(e.message || "感情分析に失敗しました");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleFactInference = async (transcription: string) => {
        setLoading(true);
        setLoadingMessage("ファクト＆推測抽出中です...");
        try {
            const result = await analyzeFactInference(transcription);
            setFacts(result.facts);
            setInferences(result.inferences);
            setFactInferenceModalOpen(true);
        } catch (e: any) {
            alert(e.message || "ファクト＆推測抽出に失敗しました");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const filteredSummaries = summaries
    .filter((s) =>
        s.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((s) => {
        if (!dateFilter) return true;
        const summaryDate = new Date(s.created_at).toISOString().slice(0, 10);
        return summaryDate === dateFilter;
    });

return (
    <Box sx={{ p: 4 }}>
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress color="inherit" />
                <Typography>{loadingMessage || "処理中です..."}</Typography>
            </Stack>
        </Backdrop>

        <Typography variant="h4" gutterBottom>
            要約履歴一覧
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                label="ファイル名で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                type="date"
                label="作成日で絞り込み"
                InputLabelProps={{ shrink: true }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                />
            </Grid>
        </Grid>

        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
                {error}
            </Typography>
        )}

        <Grid container spacing={2}>
            {filteredSummaries.length === 0 && (
                <Typography variant="body1">
                    履歴は見つかりませんでした。
                </Typography>
            )}

            {filteredSummaries.map((summary) => (
                <Grid item xs={12} md={6} key={summary.id}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">{summary.filename}</Typography>
                            <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                            >
                                {summary.summary.slice(0, 50)}...
                            </Typography>
                            <Typography
                            variant="caption"
                            sx={{ display: "block", mt: 1, color: "text.secondary" }}
                            >
                                作成日時：{new Date(summary.created_at).toLocaleString()}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                                <Button
                                variant="contained"
                                size="small"
                                onClick={() => openFullSummaryModal(summary.summary)}
                                >
                                    全文を見る
                                </Button>
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleResummarize(summary.transcription)}
                                >
                                    再要約
                                </Button>
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleFactInference(summary.transcription)}
                                >
                                    ファクト＆推測抽出
                                </Button>
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleExtractActions(summary.transcription)}
                                >
                                    アクション抽出
                                </Button>
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleAnalyzeEmotion(summary.transcription)}
                                >
                                    感情分析
                                </Button>
                                <Button
                                variant="outlined"
                                size="small"
                                onClick={() => downloadSummary(summary)}
                                >
                                    ダウンロード
                                </Button>
                                <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(summary.id)}
                                >
                                    削除
                                </Button>
                            </Stack>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>

        <FullSummaryModal
        isOpen={fullSummaryModalOpen}
        onRequestClose={() => setFullSummaryModalOpen(false)}
        summaryText={fullSummaryText}
        />
        <EmotionModal
        isOpen={emotionModalOpen}
        onRequestClose={closeEmotionModal}
        emotionText={emotionText}
        />
        <ResummaryModal
        isOpen={resummaryModalOpen}
        onRequestClose={() => setResummaryModalOpen(false)}
        summaryText={resummaryText}
        />
        <ActionItemsModal
        isOpen={actionItemsModalOpen}
        onRequestClose={() => setActionItemsModalOpen(false)}
        items={actionItems}
        />
        <FactInferenceModal
        isOpen={FactInferenceModalOpen}
        onRequestClose={() => setFactInferenceModalOpen(false)}
        facts={facts}
        inferences={inferences}
        />
    </Box>
    );
};

export default SummaryList;