const { spawn } = require('child_process');
const path = require('path');
const s3Service = require('../services/s3Service');
const fs = require('fs').promises;
const os = require('os');

/**
 * Verify quest completion using AI model
 * Expects: { imageKey, imageUrl, successCriteria, questId }
 */
exports.verifyQuest = async (req, res) => {
  let tempFilePath = null;

  try {
    const { imageKey, imageUrl, successCriteria } = req.body;

    if (!imageKey && !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image key or URL is required'
      });
    }

    if (!successCriteria) {
      return res.status(400).json({
        success: false,
        error: 'Success criteria is required'
      });
    }

    console.log('Verifying quest with criteria:', successCriteria);

    // Download image from S3
    let imageBuffer;
    if (imageKey) {
      imageBuffer = await s3Service.getObject(imageKey);
    } else {
      // Fetch from URL if no key provided
      const fetch = require('node-fetch');
      const response = await fetch(imageUrl);
      imageBuffer = await response.buffer();
    }

    // Save to temp file
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `quest-verify-${Date.now()}.jpg`);
    await fs.writeFile(tempFilePath, imageBuffer);

    console.log('Image saved to:', tempFilePath);

    // Call Python model
    const pythonScript = path.join(__dirname, '../model/model.py');
    const pythonProcess = spawn('python', [pythonScript, tempFilePath, successCriteria]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', stderr);
          reject(new Error(`Python script exited with code ${code}`));
        } else {
          resolve();
        }
      });

      pythonProcess.on('error', (error) => {
        reject(error);
      });
    });

    // Clean up temp file
    try {
      await fs.unlink(tempFilePath);
      tempFilePath = null;
    } catch (err) {
      console.warn('Failed to delete temp file:', err);
    }

    console.log('Python script output:', stdout);

    // Parse JSON output from Python script
    const lines = stdout.trim().split('\n');
    const jsonLine = lines[lines.length - 1]; // Get last line (JSON output)
    
    let result;
    try {
      result = JSON.parse(jsonLine);
    } catch (parseError) {
      console.error('Failed to parse Python output as JSON:', jsonLine);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse verification result',
        details: stdout
      });
    }

    // Return verification result
    return res.json({
      success: result.success,
      verified: result.verified || result.success,
      response: result.response || '',
      error: result.error || null
    });

  } catch (error) {
    console.error('Quest verification error:', error);
    
    // Clean up temp file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.warn('Failed to delete temp file on error:', err);
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify quest'
    });
  }
};
