const fetch = require('node-fetch');

exports.GenerateLogo = async (req, res) => {
  const apiUrl = 'https://api.limewire.com/api/image/generation';
  const apiKey = 'lmwr_sk_xJUEkwmSyn_QgJ2AuqyRSk7BHLlGofdL8nyzgQL4Be1S1pxX';
 // dd15a51a-1f04-4d69-a62f-b241291e3b17

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': 'v1',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    if (!apiResponse.ok) {
      console.error('API response status:', apiResponse.status);
      res.status(500).json({ error: 'API request failed' });
      return;
    }

    const data = await apiResponse.json();
    
    if (data.data && data.data.length > 0 && data.data[0].asset_url) {
      res.json({ imageUrl: data.data[0].asset_url });
    } else {
      console.error('No assets found in response:', data);
      res.status(500).json({ error: 'No assets found in API response' });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}