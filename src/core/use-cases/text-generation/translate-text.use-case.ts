import { TranslateTextResponse } from '../../../interfaces/translate-text.response';

interface Props {
  prompt: string;
  lang: string;
}

interface Response extends TranslateTextResponse {
  ok: boolean;
}

interface BadResponse {
  ok: false;
  message: string;
}

const MESSAGE_ERROR = 'No se pudo generar la traducción';

export const translateTextUseCase = async ({
  prompt,
  lang,
}: Props): Promise<Response | BadResponse> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp) {
      throw new Error(MESSAGE_ERROR);
    }

    const data = (await resp.json()) as TranslateTextResponse;

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
