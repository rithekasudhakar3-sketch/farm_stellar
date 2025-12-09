# Quest Verification System

## Overview
Generic AI-powered quest verification system using Ollama's minicpm-v model. Works for any quest type except cotton boll verification (which uses the specialized cotton.py script).

## Prerequisites
- Python 3.x installed
- Ollama running locally on port 11434
- minicpm-v model installed in Ollama: `ollama pull minicpm-v`

## Architecture

### Backend Components

1. **model.py** (`backend/model/model.py`)
   - Generic verification script that accepts any image and success criteria
   - Returns JSON with success/failure status and explanation

2. **questVerificationController.js** (`backend/controllers/questVerificationController.js`)
   - Downloads image from S3
   - Calls Python verification script
   - Parses and returns results

3. **questVerification.js** (`backend/routes/questVerification.js`)
   - Route: `POST /api/quest-verification/verify`
   - Requires authentication

## API Usage

### Endpoint
```
POST /api/quest-verification/verify
```

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body
```json
{
  "imageKey": "uploads/user123/quest-image.jpg",
  "imageUrl": "https://bucket.s3.amazonaws.com/image.jpg",
  "successCriteria": "Verify 2-3 clearly labeled bins set up for waste segregation",
  "questId": "quest_id_here"
}
```

**Note:** Either `imageKey` OR `imageUrl` is required (not both)

### Response
```json
{
  "success": true,
  "verified": true,
  "response": "VERIFIED: YES\n\nThe image shows three clearly labeled bins for waste segregation: 'Recyclable', 'Organic', and 'Non-Recyclable'. The bins are properly positioned and clearly visible.",
  "error": null
}
```

## Frontend Integration Example

```javascript
const verifyQuest = async (imageKey, successCriteria) => {
  try {
    const token = localStorage.getItem("token")
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
    
    const response = await fetch(`${backendUrl}/api/quest-verification/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        imageKey: imageKey,
        successCriteria: "Verify 2-3 clearly labeled bins set up for waste segregation"
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('Quest verified:', result.verified)
      console.log('AI Response:', result.response)
      return result
    }
  } catch (error) {
    console.error('Verification failed:', error)
  }
}
```

## Quest-Specific Success Criteria Examples

### Waste Segregation Quest
```
"Verify 2-3 clearly labeled bins set up for waste segregation. Check that bins are properly labeled with categories like 'Recyclable', 'Organic', 'Non-Recyclable', or similar."
```

### Composting Quest
```
"Verify a composting setup with organic waste materials. Look for a compost bin or pile containing food scraps, plant matter, or other biodegradable materials."
```

### Water Conservation Quest
```
"Verify a rainwater harvesting system is installed. Look for gutters, collection barrels, or tanks designed to collect and store rainwater."
```

### Organic Farming Quest
```
"Verify organic farming practices with no chemical pesticides visible. Look for natural pest control methods, companion planting, or organic fertilizers."
```

### Mulching Quest
```
"Verify mulch applied around plants or in garden beds. Check for a layer of organic material (straw, leaves, wood chips) covering the soil surface."
```

## How It Works

1. **User submits quest proof** → Image uploaded to S3
2. **Frontend calls verification API** → Sends imageKey + successCriteria
3. **Backend downloads image** → From S3 to temp file
4. **Python script analyzes** → Uses Ollama AI to verify criteria
5. **Result returned** → true/false + explanation
6. **Temp file cleaned up** → Automatic cleanup

## Testing Locally

### 1. Start Ollama
```bash
ollama serve
```

### 2. Pull the model
```bash
ollama pull minicpm-v
```

### 3. Test Python script directly
```bash
cd backend/model
python model.py "path/to/image.jpg" "Verify waste segregation bins"
```

### 4. Start backend server
```bash
cd backend
node index.js
```

### 5. Test API endpoint
```bash
curl -X POST http://localhost:4000/api/quest-verification/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "imageKey": "your-image-key",
    "successCriteria": "Verify waste segregation bins"
  }'
```

## Error Handling

The system handles:
- ✅ Missing image file
- ✅ Invalid image format
- ✅ Ollama service unavailable
- ✅ Python script errors
- ✅ Network timeouts
- ✅ Invalid JSON responses

All errors return structured JSON:
```json
{
  "success": false,
  "error": "Detailed error message",
  "response": ""
}
```

## Performance Notes

- Average verification time: 5-15 seconds (depends on image size and model speed)
- Image size limit: 50MB (configurable in backend)
- Timeout: 60 seconds for AI processing
- Temporary files automatically cleaned up after processing

## Distinguishing from Cotton Verification

**Cotton Boll Quest (boll_keeper):**
- Uses specialized `backend/cotton/cotton.py`
- Uses Roboflow inference model
- Endpoint: `/api/cotton/verify`
- Returns: `{ has_cotton, is_healthy, detection_count, detected_classes }`

**All Other Quests:**
- Use generic `backend/model/model.py`
- Uses Ollama minicpm-v model
- Endpoint: `/api/quest-verification/verify`
- Returns: `{ success, verified, response }`

## Troubleshooting

### "Model not found" error
```bash
ollama pull minicpm-v
```

### "Connection refused" error
- Ensure Ollama is running: `ollama serve`
- Check if port 11434 is accessible

### "Python not found" error
- Ensure Python is in system PATH
- Try using `python3` instead of `python` in spawn command

### Verification always returns false
- Check success criteria clarity
- Review AI response for reasoning
- Ensure image quality is sufficient
- Verify image actually shows what criteria requires
