interface Props {
  originalImage: string;
}

interface Image {
  url: string;
  alt: string;
}

type GeneratedImage = Image | null;

const MESSAGE_ERROR = 'No se pudo generar la imagen';
export const imageVariationUseCase = async (
  props: Props
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-variation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseImage: props.originalImage,
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
