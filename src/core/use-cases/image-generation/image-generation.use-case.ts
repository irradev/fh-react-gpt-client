interface Props {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

interface Image {
  url: string;
  alt: string;
}

type GeneratedImage = Image | null;

const MESSAGE_ERROR = 'No se pudo generar la imagen';
export const imageGenerationUseCase = async (
  props: Props
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: props.prompt,
          originalImage: props.originalImage,
          maskImage: props.maskImage,
        }),
      }
    );

    if (!response.ok) {
      console.log(MESSAGE_ERROR);
      return null;
    }

    const { url, revised_prompt: alt } = await response.json();

    return {
      url,
      alt,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
