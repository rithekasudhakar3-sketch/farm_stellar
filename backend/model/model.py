import base64
import requests
import json
import sys
import os

API_URL = "http://localhost:11434/api/generate"

def verify_quest(image_path, success_criteria):
    """
    Verify if a quest is completed based on the image and success criteria.
    
    Args:
        image_path (str): Path to the image file
        success_criteria (str): Description of what needs to be verified in the image
        
    Returns:
        dict: Contains 'success' (bool), 'response' (str), and optional 'error' (str)
    """
    try:
        # Check if file exists
        if not os.path.exists(image_path):
            return {
                "success": False,
                "error": "Image file not found",
                "response": ""
            }
        
        # Read and encode image
        with open(image_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode()
        
        # Prepare prompt for verification
        verification_prompt = f"""Analyze this image and verify if it meets the following criteria:
{success_criteria}

Respond with:
1. "VERIFIED: YES" or "VERIFIED: NO" on the first line
2. A brief explanation of what you see and why it does or doesn't meet the criteria

Be strict and thorough in your verification."""

        payload = {
            "model": "minicpm-v",
            "prompt": verification_prompt,
            "images": [img_b64],
            "stream": False
        }
        
        # Call Ollama API
        res = requests.post(API_URL, json=payload, timeout=60)
        
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"API request failed with status {res.status_code}",
                "response": ""
            }
        
        response_data = res.json()
        response_text = response_data.get("response", "")
        
        # Parse the response to determine success
        verified = "VERIFIED: YES" in response_text.upper() or "VERIFIED:YES" in response_text.upper()
        
        return {
            "success": verified,
            "response": response_text,
            "verified": verified
        }
        
    except requests.RequestException as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}",
            "response": ""
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "response": ""
        }

if __name__ == "__main__":
    # Check if arguments are provided
    if len(sys.argv) < 3:
        result = {
            "success": False,
            "error": "Usage: python model.py <image_path> <success_criteria>",
            "response": ""
        }
    else:
        image_path = sys.argv[1]
        success_criteria = sys.argv[2]
        result = verify_quest(image_path, success_criteria)
    
    # Output as JSON
    print(json.dumps(result))