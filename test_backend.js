// Simple test script to verify backend API functionality
// Run this in the browser console or as a Node.js script

const API_BASE_URL = 'http://localhost:8000';

async function testBackend() {
  console.log('🧪 Testing Mini CRM Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);

    // Test 2: Get Leads
    console.log('\n2. Testing Get Leads...');
    const leadsResponse = await fetch(`${API_BASE_URL}/leads`);
    const leadsData = await leadsResponse.json();
    console.log('✅ Get Leads:', leadsData.length, 'leads found');

    // Test 3: Create Lead Manually
    console.log('\n3. Testing Create Lead Manually...');
    const newLead = {
      name: "Test User",
      email: "test@example.com",
      phone: "+1 (555) 999-8888"
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/leads/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLead)
    });
    
    const createdLead = await createResponse.json();
    console.log('✅ Created Lead:', createdLead);

    // Test 4: LLM Interaction
    console.log('\n4. Testing LLM Interaction...');
    const interactionResponse = await fetch(`${API_BASE_URL}/interact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: createdLead.id,
        prompt: "What are the details for this lead?"
      })
    });
    
    const interactionData = await interactionResponse.json();
    console.log('✅ LLM Interaction:', interactionData);

    // Test 5: Update Lead Status
    console.log('\n5. Testing Update Lead Status...');
    const updateResponse = await fetch(`${API_BASE_URL}/leads/${createdLead.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: "Contacted" })
    });
    
    const updatedLead = await updateResponse.json();
    console.log('✅ Updated Lead Status:', updatedLead);

    // Test 6: Workflow Execution
    console.log('\n6. Testing Workflow Execution...');
    const workflowData = {
      name: "Test Workflow",
      description: "Test workflow execution",
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          position: { x: 100, y: 100 },
          data: { label: "Lead Created" }
        },
        {
          id: "action-1",
          type: "action",
          position: { x: 300, y: 100 },
          data: { label: "Send Welcome Email" }
        }
      ],
      edges: [
        {
          id: "edge-1",
          source: "trigger-1",
          target: "action-1"
        }
      ]
    };
    
    const workflowResponse = await fetch(`${API_BASE_URL}/workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData)
    });
    
    const workflowResult = await workflowResponse.json();
    console.log('✅ Workflow Execution:', workflowResult);

    // Test 7: Get Workflows
    console.log('\n7. Testing Get Workflows...');
    const workflowsResponse = await fetch(`${API_BASE_URL}/workflows`);
    const workflowsData = await workflowsResponse.json();
    console.log('✅ Get Workflows:', workflowsData.workflows.length, 'workflows found');

    // Test 8: Delete Test Lead
    console.log('\n8. Cleaning up - Delete Test Lead...');
    const deleteResponse = await fetch(`${API_BASE_URL}/leads/${createdLead.id}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Test Lead Deleted Successfully');
    } else {
      console.log('❌ Failed to delete test lead');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Backend is working correctly');
    console.log('✅ Frontend can now connect to the API');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend is running: uvicorn main:app --reload --host 0.0.0.0 --port 8000');
    console.log('2. Check if the backend is accessible at: http://localhost:8000');
    console.log('3. Verify CORS settings in the backend');
  }
}

// Run the test
testBackend(); 