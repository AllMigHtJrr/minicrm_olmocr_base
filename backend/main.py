from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import aiofiles
from datetime import datetime
import uuid
from typing import List, Dict, Any
import logging
from PIL import Image
import io
import re
from contextlib import asynccontextmanager

from models import (
    LeadCreate, LeadResponse, LeadStatusUpdate, LeadInteraction, 
    InteractionResponse, WorkflowRequest, WorkflowResponse, 
    DocumentExtractionResponse, LeadStatus, LeadSource, ErrorResponse, SuccessResponse
)
from utils import (
    validate_email, extract_email_from_text, extract_name_from_text,
    save_uploaded_file, cleanup_temp_file, olmocr_extraction,
    validate_workflow_structure, get_workflow_action_description,
    sanitize_text, generate_unique_id, OLM_OCR_AVAILABLE
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for leads and workflows
leads_data = []
workflows_data = {"workflows": [], "last_updated": datetime.now().isoformat()}
next_id = 1

# Load initial data from JSON files
async def load_data_from_files():
    global leads_data, workflows_data, next_id
    
    # Load leads
    try:
        async with aiofiles.open("leads.json", "r") as file:
            content = await file.read()
            leads_data = json.loads(content)
            if leads_data:
                next_id = max(lead["id"] for lead in leads_data) + 1
    except FileNotFoundError:
        logger.info("leads.json not found, starting with empty leads")
        leads_data = []
        next_id = 1
    
    # Load workflows
    try:
        async with aiofiles.open("workflow.json", "r") as file:
            content = await file.read()
            workflows_data = json.loads(content)
    except FileNotFoundError:
        logger.info("workflow.json not found, starting with empty workflows")
        workflows_data = {"workflows": [], "last_updated": datetime.now().isoformat()}

# Save data to JSON files
async def save_leads_to_file():
    async with aiofiles.open("leads.json", "w") as file:
        await file.write(json.dumps(leads_data, indent=2, default=str))

async def save_workflows_to_file():
    workflows_data["last_updated"] = datetime.now().isoformat()
    async with aiofiles.open("workflow.json", "w") as file:
        await file.write(json.dumps(workflows_data, indent=2, default=str))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await load_data_from_files()
    
    # Check OLM OCR availability
    if not OLM_OCR_AVAILABLE:
        logger.warning("⚠️ OLM OCR libraries not available. Document processing will not work.")
        logger.warning("Install OLM OCR libraries: pip install transformers torch pdf2image opencv-python accelerate")
    else:
        logger.info("✅ OLM OCR libraries available. Document processing enabled.")
        logger.info("🔄 OLM OCR model (allenai/olmOCR-7B-0225-preview) will be loaded on first document upload...")
    
    logger.info("Mini CRM API with Agentic AI started successfully")
    
    yield
    
    # Shutdown
    logger.info("Mini CRM API shutting down...")

app = FastAPI(
    title="Mini CRM API - Agentic AI Edition",
    description="A FastAPI backend for Mini CRM application with agentic AI features",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:4028"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced Lead Management Endpoints

@app.post("/leads/manual", response_model=LeadResponse)
async def create_lead_manual(lead: LeadCreate):
    """Create a new lead manually with enhanced validation"""
    global next_id
    
    # Additional validation
    if not validate_email(lead.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    new_lead = {
        "id": next_id,
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
        "status": LeadStatus.NEW,
        "source": LeadSource.MANUAL,
        "created_at": datetime.now().isoformat()
    }
    
    leads_data.append(new_lead)
    next_id += 1
    
    await save_leads_to_file()
    logger.info(f"Created new lead with agentic validation: {new_lead['name']}")
    
    return LeadResponse(**new_lead)

@app.post("/leads/document", response_model=DocumentExtractionResponse)
async def create_lead_from_document(file: UploadFile = File(...)):
    """Extract lead information from uploaded document using OLM OCR"""
    
    # Validate file type
    allowed_extensions = ('.pdf', '.png', '.jpg', '.jpeg')
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400, 
            detail=f"Only {', '.join(allowed_extensions)} files are supported"
        )
    
    # Check OLM OCR availability
    if not OLM_OCR_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="OLM OCR processing is not available. Please install OLM OCR libraries: pip install transformers torch pdf2image opencv-python accelerate"
        )
    
    temp_file_path = None
    try:
        # Read file content
        content = await file.read()
        
        # Save file temporarily
        temp_file_path = await save_uploaded_file(content, file.filename)
        
        # Use OLM OCR for extraction
        extracted_data = olmocr_extraction(content, file.filename)
        
        # Check for OLM OCR errors
        if "error" in extracted_data:
            raise HTTPException(
                status_code=422,
                detail=f"OLM OCR processing failed: {extracted_data['error']}"
            )
        
        # Validate extracted data
        if not extracted_data.get("name") or extracted_data["name"] == "Name Not Found":
            logger.warning("No name found in document")
            extracted_data["name"] = "Name Not Found"
        
        if not extracted_data.get("email") or extracted_data["email"] == "email@not.found":
            logger.warning("No email found in document")
            extracted_data["email"] = "email@not.found"
        
        if not extracted_data.get("phone") or extracted_data["phone"] == "Phone Not Found":
            logger.warning("No phone found in document")
            extracted_data["phone"] = "Phone Not Found"
        
        # Calculate confidence based on what was found
        found_fields = sum(1 for field in ['name', 'email', 'phone'] 
                          if extracted_data.get(field) and 
                          extracted_data[field] not in ['Name Not Found', 'email@not.found', 'Phone Not Found'])
        confidence = found_fields / 3.0
        
        # Create extraction notes
        extraction_notes = []
        if extracted_data.get("raw_text"):
            extraction_notes.append(f"OLM OCR extracted {len(extracted_data['raw_text'])} characters")
        if confidence < 1.0:
            missing_fields = []
            if extracted_data["name"] == "Name Not Found":
                missing_fields.append("name")
            if extracted_data["email"] == "email@not.found":
                missing_fields.append("email")
            if extracted_data["phone"] == "Phone Not Found":
                missing_fields.append("phone")
            extraction_notes.append(f"Missing fields: {', '.join(missing_fields)}")
        
        # Create response
        response = DocumentExtractionResponse(
            name=extracted_data["name"],
            email=extracted_data["email"],
            phone=extracted_data["phone"],
            status=LeadStatus.NEW,
            source=LeadSource.DOCUMENT,
            confidence=confidence,
            extraction_notes="; ".join(extraction_notes) if extraction_notes else "OLM OCR extraction successful"
        )
        
        logger.info(f"OLM OCR extracted lead from document: {response.name} (confidence: {confidence:.2f})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
    
    finally:
        # Clean up temporary file
        if temp_file_path:
            await cleanup_temp_file(temp_file_path)

@app.get("/leads", response_model=List[LeadResponse])
async def get_leads():
    """Get all leads"""
    return [LeadResponse(**lead) for lead in leads_data]

@app.delete("/leads/{lead_id}")
async def delete_lead(lead_id: int):
    """Delete a lead by ID"""
    global leads_data
    
    lead_index = None
    for i, lead in enumerate(leads_data):
        if lead["id"] == lead_id:
            lead_index = i
            break
    
    if lead_index is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    deleted_lead = leads_data.pop(lead_index)
    await save_leads_to_file()
    
    logger.info(f"Deleted lead: {deleted_lead['name']}")
    return SuccessResponse(message=f"Lead {lead_id} deleted successfully")

@app.put("/leads/{lead_id}/status")
async def update_lead_status(lead_id: int, status_update: LeadStatusUpdate):
    """Update lead status"""
    lead = None
    for l in leads_data:
        if l["id"] == lead_id:
            lead = l
            break
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead["status"] = status_update.status
    await save_leads_to_file()
    
    logger.info(f"Updated lead {lead_id} status to: {status_update.status}")
    return LeadResponse(**lead)

# Enhanced Lead Interaction with LLM

@app.post("/interact", response_model=InteractionResponse)
async def interact_with_lead(interaction: LeadInteraction):
    """Enhanced interaction with a lead using LLM with context awareness"""
    
    # Find the lead
    lead = None
    for l in leads_data:
        if l["id"] == interaction.id:
            lead = l
            break
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Sanitize prompt
    prompt = sanitize_text(interaction.prompt).lower()
    
    # Enhanced LLM responses with context awareness
    if "follow-up" in prompt:
        reply = f"Email {lead['name']} at {lead['email']} for follow-up. Current status: {lead['status']}"
    elif "details" in prompt:
        reply = f"Name: {lead['name']}, Email: {lead['email']}, Phone: {lead['phone']}, Status: {lead['status']}, Source: {lead['source']}"
    elif "contact" in prompt:
        reply = f"Contact {lead['name']} at {lead['phone']} or {lead['email']}. Best time to reach: Business hours"
    elif "status" in prompt:
        reply = f"Current status of {lead['name']}: {lead['status']}. Last updated: {lead.get('created_at', 'Unknown')}"
    elif "source" in prompt:
        reply = f"{lead['name']} was added via {lead['source']} method"
    elif "next" in prompt or "action" in prompt:
        if lead['status'] == 'New':
            reply = f"Next action for {lead['name']}: Send welcome email and schedule initial call"
        else:
            reply = f"Next action for {lead['name']}: Follow up on previous contact and assess interest"
    else:
        reply = f"Ask about follow-up, details, contact, status, source, or next actions for {lead['name']}."
    
    # Include lead context in response
    lead_context = {
        "id": lead["id"],
        "name": lead["name"],
        "status": lead["status"],
        "source": lead["source"]
    }
    
    logger.info(f"LLM interaction for lead {lead['name']}: {interaction.prompt}")
    
    return InteractionResponse(reply=reply, lead_context=lead_context)

# Enhanced Workflow Designer with React Flow Support

@app.post("/workflow", response_model=WorkflowResponse)
async def execute_workflow(workflow: WorkflowRequest):
    """Execute a workflow with React Flow nodes and edges"""
    
    logger.info("Executing enhanced workflow...")
    
    # Validate workflow structure
    is_valid, validation_message = validate_workflow_structure(
        [node.dict() for node in workflow.nodes],
        [edge.dict() for edge in workflow.edges]
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail=validation_message)
    
    execution_log = []
    workflow_id = f"workflow-{generate_unique_id()}"
    
    # Simulate workflow execution by logging node actions
    for node in workflow.nodes:
        node_type = node.type
        node_data = node.data
        
        if node_type == "trigger":
            action_desc = f"Trigger node: {node_data.get('label', 'Unknown trigger')}"
            logger.info(action_desc)
            execution_log.append(f"[{datetime.now().isoformat()}] {action_desc}")
            
        elif node_type == "action":
            action_desc = get_workflow_action_description(node_data)
            logger.info(action_desc)
            execution_log.append(f"[{datetime.now().isoformat()}] {action_desc}")
            
        else:
            action_desc = f"Unknown node type: {node_type}"
            logger.info(action_desc)
            execution_log.append(f"[{datetime.now().isoformat()}] {action_desc}")
    
    # Log connections
    for edge in workflow.edges:
        connection_desc = f"Connection: {edge.source} -> {edge.target}"
        logger.info(connection_desc)
        execution_log.append(f"[{datetime.now().isoformat()}] {connection_desc}")
    
    # Save workflow to storage
    workflow_data = {
        "id": workflow_id,
        "name": workflow.name,
        "description": workflow.description,
        "nodes": [node.dict() for node in workflow.nodes],
        "edges": [edge.dict() for edge in workflow.edges],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    workflows_data["workflows"].append(workflow_data)
    await save_workflows_to_file()
    
    return WorkflowResponse(
        message="Workflow executed successfully",
        workflow_id=workflow_id,
        execution_log=execution_log
    )

@app.get("/workflows")
async def get_workflows():
    """Get all saved workflows"""
    return workflows_data

@app.delete("/workflows/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Delete a workflow by ID"""
    global workflows_data
    
    workflow_index = None
    for i, workflow in enumerate(workflows_data["workflows"]):
        if workflow["id"] == workflow_id:
            workflow_index = i
            break
    
    if workflow_index is None:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    deleted_workflow = workflows_data["workflows"].pop(workflow_index)
    await save_workflows_to_file()
    
    logger.info(f"Deleted workflow: {deleted_workflow['name']}")
    return SuccessResponse(message=f"Workflow {workflow_id} deleted successfully")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "leads_count": len(leads_data),
        "workflows_count": len(workflows_data["workflows"]),
        "olm_ocr_available": OLM_OCR_AVAILABLE
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Mini CRM API - Agentic AI Edition",
        "version": "2.0.0",
        "features": [
            "Enhanced Lead Management with Validation",
            "OLM OCR Document Processing (allenai/olmOCR-7B-0225-preview)",
            "Agentic LLM Interactions",
            "React Flow Workflow Designer",
            "Workflow Persistence and Execution"
        ],
        "olm_ocr_status": "Available" if OLM_OCR_AVAILABLE else "Not Available",
        "endpoints": {
            "leads": "/leads",
            "create_manual": "/leads/manual",
            "create_document": "/leads/document",
            "interact": "/interact",
            "workflow": "/workflow",
            "workflows": "/workflows"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 