from sqlalchemy.orm import Session
from app.models import Summary
from app.schemas import SummaryCreate

def create_summary(db: Session, summary_data: SummaryCreate):
    db_summary = Summary(**summary_data.dict())
    db.add(db_summary)
    db.commit()
    db.refresh(db_summary)
    return db_summary

def get_summaries(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Summary).order_by(Summary.created_at.desc()).offset(skip).limit(limit).all()