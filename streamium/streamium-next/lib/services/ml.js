const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:5000';

export async function getMLAnalysis(id) {
  try {
    const res = await fetch(`${ML_API_URL}/analyze?id=${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn(`ML Analysis service unavailable. Using fallback values.`);
    return null;
  }
}

export async function getMLRecommendations(query, topN = 10) {
  try {
    const res = await fetch(`${ML_API_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_n: topN }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? []; 
  } catch (error) {
    console.warn('ML Recommendations service unavailable. Using fallback values.');
    return [];
  }
}
