const MESSAGE_ERROR = 'No se pudo generar la información';

const INFINITY_LOOP = true;

export async function* prosConsStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!resp.ok) {
      console.log(MESSAGE_ERROR);

      return null;
    }

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('No se pudo generar el reader');
      return null;
    }

    const decoder = new TextDecoder();
    let message = '';

    while (INFINITY_LOOP) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedChunk = decoder.decode(value, { stream: true });
      message += decodedChunk;
      yield message;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
