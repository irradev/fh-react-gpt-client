import { useRef, useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from '../../components';
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortController = useRef(new AbortController());

  const handlePost = async (text: string) => {
    if (isRunning) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    setIsRunning(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const stream = prosConsStreamGeneratorUseCase(
      text,
      abortController.current.signal
    );
    setIsLoading(false);

    if (!stream) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar la información. Intenta de nuevo',
          isGpt: true,
        },
      ]);

      setIsRunning(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        text: '',
        isGpt: true,
      },
    ]);

    for await (const chunk of stream) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = chunk;
        return newMessages;
      });
    }

    setIsRunning(false);
  };

  const handleCancelResponse = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setIsLoading(false);
    setIsRunning(false);

    setMessages((prev) => [
      ...prev,
      {
        text: 'Respuesta cancelada por el usuario',
        isGpt: true,
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage
                key={index}
                text={message.text}
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
        isLoading={isLoading || isRunning}
        isCancelable
        onCancel={handleCancelResponse}
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
