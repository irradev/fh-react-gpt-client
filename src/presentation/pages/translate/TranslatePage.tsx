import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'inglés', text: 'Inglés' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedLanguage: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedLanguage}`;
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);

    const data = await translateTextUseCase({
      prompt: text,
      lang: selectedLanguage,
    });

    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar la traducción',
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
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedo traducir el texto que quieras a un idioma de tu elección" />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        isLoading={isLoading}
        placeholder="Escribe aquí lo que traducir"
        disableCorrections
        options={languages}
      />
    </div>
  );
};
