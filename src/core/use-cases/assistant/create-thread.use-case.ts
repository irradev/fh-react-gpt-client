const MESSAGE_ERROR = 'No se pudo crear el thread';
export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/create-thread`,
      {
        method: 'POST',
      }
    );

    if (!resp.ok) throw new Error(MESSAGE_ERROR);

    const { id } = (await resp.json()) as { id: string };

    return {
      ok: true,
      id,
    };
  } catch (error) {
    return {
      ok: false,
      message: MESSAGE_ERROR,
    };
  }
};
