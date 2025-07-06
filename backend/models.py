from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class LeadStatus(str, Enum):
    NEW = "New"
    CONTACTED = "Contacted"

class LeadSource(str, Enum):
    MANUAL = "Manual"
    DOCUMENT = "Document"

class LeadCreate(BaseModel):
    name: str
    email: str
    phone: str
    
    @validator('email')
    def validate_email(cls, v):
        import re
        email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v.strip():
            raise ValueError('Phone cannot be empty')
        return v.strip()

class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    status: LeadStatus
    source: LeadSource
    created_at: datetime

class LeadStatusUpdate(BaseModel):
    status: LeadStatus

class LeadInteraction(BaseModel):
    id: int
    prompt: str
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if not v.strip():
            raise ValueError('Prompt cannot be empty')
        return v.strip()

class InteractionResponse(BaseModel):
    reply: str
    lead_context: Optional[Dict[str, Any]] = None

class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class WorkflowRequest(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    name: Optional[str] = "Unnamed Workflow"
    description: Optional[str] = ""

class WorkflowResponse(BaseModel):
    message: str
    workflow_id: Optional[str] = None
    execution_log: Optional[List[str]] = None

class DocumentExtractionResponse(BaseModel):
    name: str
    email: str
    phone: str = "N/A"
    status: LeadStatus = LeadStatus.NEW
    source: LeadSource = LeadSource.DOCUMENT
    confidence: Optional[float] = None
    extraction_notes: Optional[str] = None

class WorkflowExecutionLog(BaseModel):
    timestamp: datetime
    action: str
    details: str
    node_id: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
    timestamp: datetime = datetime.now()

class SuccessResponse(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = datetime.now() 