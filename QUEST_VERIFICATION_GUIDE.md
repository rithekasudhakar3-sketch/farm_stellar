# Quest Verification Integration Guide

## Overview
This system automatically verifies quest submissions using AI:
- **Cotton Boll Quest (boll_keeper)**: Uses specialized cotton.py with Roboflow
- **All Other Quests**: Uses generic model.py with Ollama for visual verification

## How It Works

### 1. Quest Setup (Backend)
Each quest in the database needs a `verification_data` field:

```javascript
{
  title: "Waste Segregation Setup",
  description: "Set up proper waste segregation bins",
  verification_data: {
    task_name: "waste_segregation",
    success_criteria: "Verify 2-3 clearly labeled bins set up for waste segregation. Check that bins are properly labeled with categories like 'Recyclable', 'Organic', 'Non-Recyclable', or similar.",
    use_before_image: false
  }
}
```

### 2. User Submits Quest (Frontend)
When user clicks "Submit for Review" in `submit-proof-screen.jsx`:

1. **Image is uploaded to S3**
2. **Quest details are fetched** (including success_criteria)
3. **Verification endpoint is called**:
   - Cotton quest → `/api/cotton/verify`
   - Other quests → `/api/quest-verification/verify`
4. **Verification result is passed to verification screen**

### 3. Verification Flow

#### For Cotton Boll Quest:
```javascript
POST /api/cotton/verify
{
  "imageKey": "uploads/user123/image.jpg",
  "imageUrl": "https://..."
}

Response:
{
  "success": true,
  "has_cotton": true,
  "is_healthy": true,
  "detection_count": 3,
  "detected_classes": ["Full opened"]
}
```

#### For Other Quests:
```javascript
POST /api/quest-verification/verify
{
  "imageKey": "uploads/user123/image.jpg",
  "imageUrl": "https://...",
  "successCriteria": "Verify 2-3 clearly labeled bins...",
  "questId": "zero_waste"
}

Response:
{
  "success": true,
  "verified": true,
  "response": "VERIFIED: YES\n\nThe image shows three clearly labeled bins..."
}
```

### 4. Results Display (verification-screen.jsx)

Results are displayed with AI analysis:

**Cotton Quest:**
- Health Status: Healthy ✓ / Not Fully Opened
- Cotton Bolls Detected: X boll(s)
- Detected Classes: Full opened, etc.

**Other Quests:**
- Verification Status: Verified ✓ / Not Verified
- AI Response: Full explanation of what was found
- Success/Failure feedback

### 5. Data Storage

Results are saved in Submission model:

```javascript
{
  userId: "...",
  questId: "zero_waste",
  media: [...],
  status: "pending",
  
  // For cotton quest
  cottonVerification: {
    success: true,
    has_cotton: true,
    is_healthy: true,
    detected_classes: ["Full opened"],
    detection_count: 3
  },
  
  // For other quests
  questVerification: {
    success: true,
    verified: true,
    response: "VERIFIED: YES\n\n..."
  }
}
```

## Adding New Quests

### Step 1: Update Quest in Database

Add verification criteria to your quest:

```javascript
db.quests.updateOne(
  { id: "your_quest_id" },
  {
    $set: {
      "verification_data": {
        "task_name": "your_task_name",
        "success_criteria": "Detailed description of what AI should verify in the image",
        "use_before_image": false
      }
    }
  }
)
```

### Step 2: Write Good Success Criteria

The success_criteria should be:
- **Specific**: Describe exactly what should be visible
- **Measurable**: Include quantities, colors, arrangements
- **Clear**: Use simple language the AI can understand

**Good Examples:**

```
"Verify a composting setup with visible organic waste materials. Look for a compost bin or pile containing food scraps, plant matter, or other biodegradable materials. The setup should show active decomposition or layering of materials."

"Verify mulch applied around plants in garden beds. Check for a visible layer of organic material (straw, leaves, wood chips, or similar) covering the soil surface around plants. The mulch layer should be at least 2-3 inches thick."

"Verify a rainwater harvesting system is installed and functional. Look for gutters connected to collection barrels, tanks, or storage containers designed to collect and store rainwater. The system should show proper drainage from roof to storage."
```

**Bad Examples:**
```
❌ "Check if quest is done" (too vague)
❌ "Verify completion" (no details)
❌ "Look at the image" (no criteria)
```

### Step 3: Test Your Quest

1. **Submit a test image**
2. **Check verification results**
3. **Review AI response**
4. **Adjust success_criteria if needed**

## Example Quest Scenarios

### Waste Segregation Quest
```javascript
verification_data: {
  task_name: "waste_segregation",
  success_criteria: "Verify 2-3 clearly labeled bins set up for waste segregation. The bins should have visible labels indicating categories such as 'Recyclable', 'Organic', 'Non-Recyclable', 'Plastic', 'Paper', or similar waste categories. The bins should be distinct and properly positioned.",
  use_before_image: false
}
```

### Composting Quest
```javascript
verification_data: {
  task_name: "composting_setup",
  success_criteria: "Verify a composting setup with organic waste materials visible. Look for a compost bin, pile, or designated area containing food scraps, kitchen waste, plant matter, dried leaves, or other biodegradable materials. The setup should show evidence of composting activity such as layered materials or decomposition in progress.",
  use_before_image: false
}
```

### Mulching Quest
```javascript
verification_data: {
  task_name: "mulch_application",
  success_criteria: "Verify mulch applied around plants or in garden beds. Check for a visible layer of organic mulching material such as straw, dried leaves, wood chips, grass clippings, or similar materials covering the soil surface. The mulch should be spread around plant bases or across garden areas with a thickness of 2-3 inches.",
  use_before_image: false
}
```

### Rainwater Harvesting Quest
```javascript
verification_data: {
  task_name: "rainwater_harvesting",
  success_criteria: "Verify a rainwater harvesting system is installed. Look for gutters or downspouts connected to collection containers, barrels, tanks, or storage systems designed to capture and store rainwater. The system should show proper connectivity from roof collection to storage vessel.",
  use_before_image: false
}
```

### Organic Farming Quest
```javascript
verification_data: {
  task_name: "organic_farming",
  success_criteria: "Verify organic farming practices are being followed. Look for evidence of natural pest control methods, companion planting, organic fertilizers (compost, manure), absence of chemical containers, use of natural mulches, or other organic farming indicators. The farming area should show sustainable and chemical-free practices.",
  use_before_image: false
}
```

## Troubleshooting

### Verification Always Fails
1. **Check success_criteria**: Is it too strict or unclear?
2. **Review AI response**: What did the AI see?
3. **Test with better images**: Ensure good lighting and clear visibility
4. **Adjust criteria**: Make it more specific or less strict

### Ollama Not Working
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull the model
ollama pull minicpm-v
```

### Python Script Errors
```bash
# Test directly
cd backend/model
python model.py "path/to/test-image.jpg" "Verify waste bins"

# Check Python dependencies
pip install requests
```

### Verification Takes Too Long
- Reduce image size before upload
- Check Ollama model performance
- Increase timeout in questVerificationController.js

## Testing Checklist

- [ ] Ollama is running locally
- [ ] minicpm-v model is installed
- [ ] Quest has verification_data.success_criteria
- [ ] Test image clearly shows quest requirements
- [ ] Backend API routes are registered
- [ ] Frontend calls correct endpoint based on quest type
- [ ] Verification results display correctly
- [ ] Submission stores verification data

## API Endpoints Summary

| Quest Type | Endpoint | Purpose |
|------------|----------|---------|
| Cotton Boll | `/api/cotton/verify` | Specialized cotton health detection |
| All Others | `/api/quest-verification/verify` | Generic AI visual verification |

## Frontend Components

| Component | Purpose |
|-----------|---------|
| `submit-proof-screen.jsx` | Handles image upload and calls verification |
| `verification-screen.jsx` | Displays verification results with AI analysis |

## Backend Components

| Component | Purpose |
|-----------|---------|
| `backend/model/model.py` | Generic AI verification script |
| `backend/cotton/cotton.py` | Specialized cotton verification |
| `questVerificationController.js` | Handles generic verification API |
| `cottonController.js` | Handles cotton verification API |

## Success Criteria Best Practices

1. **Be Specific**: Describe visible elements, not abstract concepts
2. **Use Quantities**: "2-3 bins" is better than "multiple bins"
3. **Describe Appearance**: Include colors, shapes, arrangements
4. **Set Clear Standards**: Define what success looks like
5. **Test with Real Images**: Verify your criteria works in practice

## Example Success Flow

```
User submits waste segregation image
  ↓
Frontend uploads to S3
  ↓
Frontend fetches quest details (gets success_criteria)
  ↓
Frontend calls /api/quest-verification/verify
  ↓
Backend downloads image from S3
  ↓
Backend calls Python model.py with image + criteria
  ↓
Ollama AI analyzes image
  ↓
Returns: "VERIFIED: YES - Three labeled bins visible"
  ↓
Frontend displays success result
  ↓
Submission saved with verification data
```

## Next Steps

1. Add `verification_data` to all quests in database
2. Write clear success_criteria for each quest
3. Test with sample images
4. Adjust criteria based on results
5. Deploy and monitor verification accuracy
