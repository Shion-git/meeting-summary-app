from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SummaryBase(BaseModel):
    filename: str
    transcription: str
    summary: str

class SummaryCreate(SummaryBase):
    pass

class SummaryOut(SummaryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SummarizeRequest(BaseModel):
    text: str

class ActionItem(BaseModel):
    person: Optional[str] = None
    action: Optional[str] = None
    deadline: Optional[str] = None

class ActionItemRequest(BaseModel):
    text: str

class ActionItemResponse(BaseModel):
    actions: List[ActionItem]

class EmotionRequest(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    analysis: str

class FactInferenceRequest(BaseModel):
    text: str

class FactInferenceResponse(BaseModel):
    facts: List[str]
    inferences: List[str]

class FullProcessResponse(BaseModel):
    id: int
    filename: str
    transcription: str
    summary: str
    created_at: str
    emotion_analysis: Optional[str] = None
    action_items: List[ActionItem]
    fact_inference: FactInferenceResponse