import { useState } from 'react';
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    errors: {
      error: string;
      correction: string;
    }[];
    score: number;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const data = await orthographyUseCase(text);

    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo realizar la correción',
          isGpt: true,
        },
      ]);

      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        isGpt: true,
        text: data.message,
        info: {
          errors: data.errors,
          score: data.userScore,
        },
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptOrthographyMessage
                key={index}
                text={message.text}
                score={message.info?.score || 0}
                errors={message.info?.errors || []}
              />
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
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
