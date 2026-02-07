const fetch = require('node-fetch');

exports.translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    // Use Google Translate API
    // Note: You need to set GOOGLE_TRANSLATE_API_KEY in your .env file
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      console.warn('GOOGLE_TRANSLATE_API_KEY is not set. Returning mock translation.');
      // Mock response for testing if no key is provided
      return res.json({ 
        translatedText: `[${target}] ${text}`,
        originalText: text,
        target: target
      });
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: target,
        format: 'text'
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const translatedText = data.data.translations[0].translatedText;

    res.json({ translatedText });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
};
