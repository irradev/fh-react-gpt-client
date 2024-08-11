import type { ProsConsResponse } from '../../../interfaces';

const MESSAGE_ERROR = 'No se pudo generar la información';

interface Response extends ProsConsResponse {
  ok: boolean;
}

interface BadResponse {
  ok: false;
  message: string;
}

export const prosConsUseCase = async (
  prompt: string
): Promise<Response | BadResponse> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error(MESSAGE_ERROR);

    const data = (await resp.json()) as ProsConsResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      message: MESSAGE_ERROR,
    };
  }
};
