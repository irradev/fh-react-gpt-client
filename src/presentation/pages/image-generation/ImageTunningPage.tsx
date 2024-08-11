import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageSelectableImage,
} from '../../components';
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleOriginalImage = (url: string) => {
    setOriginalImageAndMask((prev) => ({ ...prev, original: url }));
  };

  const handleMaskImage = (url: string) => {
    setOriginalImageAndMask((prev) => ({ ...prev, mask: url }));
  };

  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase({
      originalImage: originalImageAndMask.original!,
    });
    setIsLoading(false);

    if (!resp) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar la imagen',
          isGpt: true,
        },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        isGpt: true,
        text: 'Variación de la imagen',
        info: {
          imageUrl: resp.url,
          alt: resp.alt,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase({
      prompt: text,
      originalImage: original,
      maskImage: mask,
    });
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar la imagen',
          isGpt: true,
        },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        isGpt: true,
        text: text,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.original ? (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            src={originalImageAndMask.mask || originalImageAndMask.original}
            alt="Imagen original"
            className="border rounded-xl w-36 h-36 object-contain"
          />
          <button
            onClick={handleVariation}
            className="btn-primary mt-2"
          >
            Generar variación
          </button>
        </div>
      ) : null}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenida */}
            <GptMessage text="¿Qué imagen deseas generar hoy?" />

            {messages.map((message, index) =>
              message.isGpt ? (
                message.info ? (
                  <GptMessageSelectableImage
                    key={index}
                    text={message.text}
                    imageUrl={message.info.imageUrl}
                    alt={message.info.alt}
                    onImageSelected={handleOriginalImage}
                    onMaskSelected={handleMaskImage}
                  />
                ) : (
                  <GptMessage
                    key={index}
                    text={message.text}
                  />
                )
              ) : (
                <MyMessage
                  key={index}
                  text={message.text}
                />
              )
            )}

            {isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )}
          </div>
        </div>

        <TextMessageBox
          onSendMessage={handlePost}
          isLoading={isLoading}
          placeholder="Escribe aquí lo que deseas"
          disableCorrections
        />
      </div>
    </>
  );
};
