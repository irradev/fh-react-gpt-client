import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
  GptMessageAudio,
} from '../../components';
import { TextToAudioUseCase } from '../../../core/use-cases';

interface TextMessage {
  text: string;
  isGpt: boolean;
  audioUrl?: string;
  type: 'text';
}

interface AudioMessage {
  text: string;
  audioUrl: string;
  isGpt: boolean;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

const disclaimer = `
  ## ¿Qué audio quieres genera hoy?
  * Todo el audio generado es por AI.
`;

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' },
];

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { text: text, isGpt: false, type: 'text' },
    ]);

    const { ok, message, audioUrl } = await TextToAudioUseCase(
      text,
      selectedVoice
    );

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar el audio',
          isGpt: true,
          type: 'text',
        },
      ]);
      setIsLoading(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        audioUrl: audioUrl!,
        isGpt: true,
        type: 'audio',
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text={disclaimer} />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.audioUrl ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audioUrl={message.audioUrl}
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        isLoading={isLoading}
        placeholder="Escribe aquí lo que deseas"
        options={voices}
      />
    </div>
  );
};
