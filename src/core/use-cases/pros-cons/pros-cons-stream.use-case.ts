const MESSAGE_ERROR = 'No se pudo generar la información';

type Response = ReadableStreamDefaultReader<Uint8Array> | undefined;
type BadResponse = null;

export const prosConsStreamUseCase = async (
  prompt: string
): Promise<Response | BadResponse> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        // todo: abortSignal
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

    return reader;
  } catch (error) {
    console.log(error);
    return null;
  }
};
