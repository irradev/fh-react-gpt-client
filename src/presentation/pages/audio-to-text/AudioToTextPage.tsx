import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases/audio-text/audio-to-text.use-case';
import { AudioToTextResponse } from '../../../interfaces/audio-to-text.response';

interface Message {
  text: string;
  isGpt: boolean;
}

const disclaimer = `
  ## Hola, envíame un archivo de audio y te daré la transcripción.
  * Tu archivo no debe pesar más de 25 MB.
`;

const MAX_SIZE_IN_MB = 25;
export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, file: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

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

    const data = await audioToTextUseCase(file, text);

    setIsLoading(false);
    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message || 'No se pudo realizar la transcripción',
          isGpt: true,
        },
      ]);

      return;
    }

    const {
      text: transcribedText,
      duration,
      segments,
    } = data as AudioToTextResponse;

    const gptMessage = `
## Transcripción:
__Duración__: ${Math.round(duration)} segundos
## El texto es:
${transcribedText}
`;
    setMessages((prev) => [
      ...prev,
      {
        isGpt: true,
        text: gptMessage,
      },
    ]);

    for (const segment of segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__ ${
        segment.text
      }
`;

      setMessages((prev) => [
        ...prev,
        {
          isGpt: true,
          text: segmentMessage,
        },
      ]);
    } // end for
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
        accept="audio/*"
        placeholder="Instrucción adicional a la transcripción (opcional)"
        disableCorrections
      />
    </div>
  );
};
