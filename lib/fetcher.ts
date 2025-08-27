export async function postJSON(url: string, data: any) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json().catch(() => ({}));
  } catch (e: any) {
    console.error("postJSON error", e);
    return { ok: false, error: e?.message };
  }
}

export async function getJSON(url: string) {
  try {
    const res = await fetch(url);
    return await res.json().catch(() => ({}));
  } catch (e: any) {
    console.error("getJSON error", e);
    return { ok: false, error: e?.message };
  }
}
