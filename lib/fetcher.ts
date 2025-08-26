export async function postJSON<T>(
  url: string,
  data: Record<string, unknown>
): Promise<T & { ok?: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = (await res.json().catch(() => ({}))) as T;
    return { ...json } as T & { ok?: boolean; error?: string };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    console.error(e);
    return { ok: false, error: errorMsg } as T & {
      ok?: boolean;
      error?: string;
    };
  }
}
