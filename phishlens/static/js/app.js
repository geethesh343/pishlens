function setSample(url) {
  document.getElementById('urlInput').value = url;
}

async function handleScan(event) {
  event.preventDefault();
  const urlInput = document.getElementById('urlInput');
  const scanBtn = document.getElementById('scanBtn');
  const scanBtnText = document.getElementById('scanBtnText');
  const scanSpinner = document.getElementById('scanSpinner');
  const errorAlert = document.getElementById('errorAlert');
  const resultsSection = document.getElementById('resultsSection');

  const rawUrl = urlInput.value.trim();

  // Reset UI
  errorAlert.style.display = 'none';
  errorAlert.textContent = '';

  // Validate protocol
  if (!/^https?:\/\//i.test(rawUrl)) {
    errorAlert.textContent = 'Validation Error: Only URLs beginning with http:// or https:// are accepted.';
    errorAlert.style.display = 'block';
    return;
  }

  // Set loading state
  scanBtn.disabled = true;
  scanBtnText.textContent = 'Analyzing...';
  scanSpinner.style.display = 'inline-block';

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rawUrl })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to analyze URL.');
    }

    displayPrediction(data.prediction, data.url);
    if (window.fetchDashboardStats) {
      window.fetchDashboardStats();
    }
  } catch (err) {
    errorAlert.textContent = err.message;
    errorAlert.style.display = 'block';
  } finally {
    scanBtn.disabled = false;
    scanBtnText.textContent = 'Analyze Link';
    scanSpinner.style.display = 'none';
  }
}

function displayPrediction(pred, url) {
  const resultsSection = document.getElementById('resultsSection');
  const resultCard = document.getElementById('resultCard');
  const resultBadge = document.getElementById('resultBadge');
  const resultTitle = document.getElementById('resultTitle');
  const riskScoreVal = document.getElementById('riskScoreVal');
  const riskMeterFill = document.getElementById('riskMeterFill');
  const recommendationBox = document.getElementById('recommendationBox');
  const recommendationText = document.getElementById('recommendationText');
  const suspiciousList = document.getElementById('suspiciousList');
  const reassuringList = document.getElementById('reassuringList');
  const featuresTbody = document.getElementById('featuresTbody');

  resultsSection.style.display = 'block';
  riskScoreVal.textContent = pred.risk_score;
  riskMeterFill.style.width = pred.risk_score + '%';

  const isPhishing = pred.classification === 'Potentially Phishing';

  if (isPhishing) {
    resultBadge.textContent = 'POTENTIALLY PHISHING';
    resultBadge.className = 'verdict-badge verdict-threat';
    riskMeterFill.style.background = '#ef4444';
    resultTitle.textContent = 'High Phishing Risk Detected';
  } else {
    resultBadge.textContent = 'LOWER RISK';
    resultBadge.className = 'verdict-badge verdict-safe';
    riskMeterFill.style.background = '#10b981';
    resultTitle.textContent = 'Lower Risk Detected';
  }

  recommendationText.textContent = pred.security_recommendation;

  // Suspicious signals
  suspiciousList.innerHTML = '';
  if (pred.suspicious_signals && pred.suspicious_signals.length > 0) {
    pred.suspicious_signals.forEach(sig => {
      const li = document.createElement('li');
      li.textContent = '⚠️ ' + sig;
      suspiciousList.appendChild(li);
    });
  } else {
    suspiciousList.innerHTML = '<li>None identified.</li>';
  }

  // Reassuring signals
  reassuringList.innerHTML = '';
  if (pred.reassuring_signals && pred.reassuring_signals.length > 0) {
    pred.reassuring_signals.forEach(sig => {
      const li = document.createElement('li');
      li.textContent = '✅ ' + sig;
      reassuringList.appendChild(li);
    });
  } else {
    reassuringList.innerHTML = '<li>No strong reassuring indicators.</li>';
  }

  // Features table
  featuresTbody.innerHTML = '';
  const feats = pred.features;
  const descriptions = {
    url_length: 'Total character count of the URL',
    hostname_length: 'Length of the domain/host string',
    dot_count: 'Frequency of dot (.) delimiters',
    hyphen_count: 'Frequency of hyphens (-) in URL',
    digit_count: 'Number of numerical digits',
    has_at_symbol: 'Presence of @ symbol in URL',
    subdomain_count: 'Number of subdomain levels',
    is_ip_address: 'Whether hostname is a raw IPv4/IPv6 address',
    is_https: 'Whether HTTPS scheme is used',
    path_length: 'Character length of the URL path',
    query_param_count: 'Number of query string parameters',
    suspicious_token_count: 'Matches with credential harvesting keywords',
    character_entropy: 'Shannon character unpredictability bits/char',
    has_unusual_port: 'Port other than 80 or 443',
    has_encoded_chars: 'Presence of % hex escape sequences'
  };

  for (const [key, val] of Object.entries(feats)) {
    if (key === 'detected_tokens') continue;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${key}</code></td>
      <td><strong>${val}</strong></td>
      <td>${descriptions[key] || ''}</td>
    `;
    featuresTbody.appendChild(tr);
  }

  resultsSection.scrollIntoView({ behavior: 'smooth' });
}
