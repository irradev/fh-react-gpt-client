import type { OrthographyResponse } from '../../../interfaces';

interface Response extends OrthographyResponse {
  ok: boolean;
}

interface BadResponse {
  ok: false;
  message: string;
}

export const orthographyUseCase = async (
  prompt: string
): Promise<Response | BadResponse> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error('No se pudo realizar la correción');

    const data = (await resp.json()) as OrthographyResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      errors: [],
      message: 'No se pudo realizar la correción',
    };
  }
};
