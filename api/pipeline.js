import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function fetchGDELTEvents() {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=conflict%20OR%20sanctions%20OR%20war%20OR%20trade%20OR%20election%20sourcelang:eng&mode=artlist&maxrecords=10&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.articles || [];
}

async function analyzeEvent(article) {
  const prompt = `You are a geopolitical financial analyst. Analyze this news event and return ONLY a JSON object with no other text:

Event: ${article.title}
Source: ${article.domain}

Return this exact JSON structure:
{
  "country": "country or region name",
  "title": "concise event title under 100 chars",
  "severity": 7.5,
  "tag1": "Primary sector affected",
  "tag2": "Secondary tag or Hidden Signal",
  "latitude": 0.0,
  "longitude": 0.0,
  "ripple": [
    {"label": "First order effect", "impact": "+5%", "up": true},
    {"label": "Second order effect", "impact": "-3%", "up": false},
    {"label": "Third order effect", "impact": "+2%", "up": true}
  ],
  "tickers": [
    {"symbol": "TICK", "direction": "up", "signal": "BUY", "impact": "+5%", "reason": "Brief reason why", "horizon": "1-2 weeks"},
    {"symbol": "TICK", "direction": "down", "signal": "SELL", "impact": "-3%", "reason": "Brief reason why", "horizon": "2-4 weeks"}
  ]
}

Severity scale: 1-10 where 10 is world war level. Only include real stock tickers. Be specific and accurate.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

async function isDuplicate(title) {
  const { data } = await supabase
    .from('signals')
    .select('id')
    .ilike('title', `%${title.substring(0, 50)}%`)
    .limit(1);
  return data && data.length > 0;
}

export default async function handler(req, res) {
  try {
    const articles = await fetchGDELTEvents();
    let added = 0;

    for (const article of articles.slice(0, 5)) {
      const duplicate = await isDuplicate(article.title);
      if (duplicate) continue;

      const analyzed = await analyzeEvent(article);
      if (!analyzed) continue;

      if (analyzed.severity < 4) continue;

      const { error } = await supabase.from('signals').insert([analyzed]);
      if (!error) added++;

      await new Promise(r => setTimeout(r, 1000));
    }

    res.status(200).json({ success: true, added, total: articles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}