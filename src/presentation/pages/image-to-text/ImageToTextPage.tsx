import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from '../../components';
import { imageToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  file?: File;
  isGpt: boolean;
}

const disclaimer = `
  ## Hola, envíame una imagen y trataré de hacer lo que me indiques.
  * Tu archivo no debe pesar más de 5 MB.
`;

const MAX_SIZE_IN_MB = 5;
export const ImageToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, file: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, file, isGpt: false }]);

    if (file.size > MAX_SIZE_IN_MB * 1024 * 1024) {
      setMessages((prev) => [
        ...prev,
        {
          text: `El archivo es muy grande. El archivo debe pesar menos de ${MAX_SIZE_IN_MB} MB`,
          isGpt: true,
        },
      ]);
      setIsLoading(false);
      return;
    }

    const data = await imageToTextUseCase(file, text);

    setIsLoading(false);
    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message || 'No se pudo generar el texto',
          isGpt: true,
        },
      ]);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        text: (data as { msg: string }).msg,
        isGpt: true,
      },
    ]);
  }; // end handlePost

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text={disclaimer} />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage
                key={index}
                text={message.text}
              />
            ) : (
              <MyMessage
                key={index}
                text={
                  message.text === '' ? 'Transcribe el audio' : message.text
                }
                file={message.file}
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

      <TextMessageBoxFile
        onSendMessage={handlePost}
        isLoading={isLoading}
        accept="image/*"
        placeholder="Instrucción adicional a la transcripción (opcional)"
        disableCorrections
      />
    </div>
  );
};
