const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const s3Service = require('../services/s3Service');
const os = require('os');

/**
 * Verify cotton boll health from uploaded image
 */
exports.verifyCotton = async (req, res) => {
  let tempFilePath = null;
  
  try {
    const { imageKey, imageUrl } = req.body;

    if (!imageKey && !imageUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Image key or URL is required' 
      });
    }

    // Download image from S3 to temporary file
    let imageBuffer;
    if (imageKey) {
      imageBuffer = await s3Service.getObject(imageKey);
    } else {
      // If URL provided, fetch it
      const response = await fetch(imageUrl);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    }

    // Create temporary file
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `cotton_${Date.now()}.jpg`);
    await fs.writeFile(tempFilePath, imageBuffer);

    // Path to Python script
    const pythonScript = path.join(__dirname, '../cotton/cotton.py');
    
    // Check if Python script exists
    try {
      await fs.access(pythonScript);
    } catch (error) {
      console.error('Python script not found:', pythonScript);
      return res.status(500).json({ 
        success: false,
        message: 'Cotton verification script not found' 
      });
    }

    // Execute Python script
    const pythonProcess = spawn('python', [pythonScript, tempFilePath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      // Clean up temporary file
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }

      if (code !== 0) {
        console.error('Python script error:', errorData);
        return res.status(500).json({ 
          success: false,
          message: 'Cotton verification failed',
          error: errorData 
        });
      }

      try {
        // Extract JSON from output (last line should be the JSON result)
        const lines = outputData.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        const result = JSON.parse(jsonLine);
        console.log('Cotton verification result:', result);
        
        res.status(200).json(result);
      } catch (parseError) {
        console.error('Failed to parse Python output:', outputData);
        console.error('Parse error:', parseError.message);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to parse verification result',
          error: parseError.message,
          rawOutput: outputData.substring(0, 500) // Include first 500 chars for debugging
        });
      }
    });

  } catch (error) {
    console.error('Cotton verification error:', error);
    
    // Clean up temporary file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during cotton verification',
      error: error.message 
    });
  }
};
