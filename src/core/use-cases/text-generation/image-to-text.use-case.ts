const MESSAGE_ERROR = 'No se pudo realizar la generación del texto';

export const imageToTextUseCase = async (file: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (prompt) formData.append('prompt', prompt);

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!resp.ok) throw new Error(MESSAGE_ERROR);

    const data = (await resp.json()) as { msg: string };

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
