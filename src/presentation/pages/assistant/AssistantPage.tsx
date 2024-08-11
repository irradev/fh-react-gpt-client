import { useEffect, useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from '../../components';
import {
  createThreadUseCase,
  postQuestionUseCase,
} from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

const INITIAL_MESSAGE = {
  text: 'Buen día, soy Roy, ¿en qué puedo ayudarte?',
  isGpt: true,
};
export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  useEffect(() => {
    const threadId = localStorage.getItem('threadId');
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase()
        .then((resp) => {
          setThreadId(resp.id);
          localStorage.setItem('threadId', resp.id!);
        })
        .catch((err) => {
          setMessages((prev) => [
            ...prev,
            {
              text: 'Por el momento no se puede generar el hilo para esta conversación. Por favor, intenta más tarde.',
              isGpt: true,
            },
          ]);
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [...prev, INITIAL_MESSAGE]);
    }
  }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const data = await postQuestionUseCase({
      threadId: threadId,
      question: text,
    });

    setIsLoading(false);

    const newMessages = data.messages.map((message) => ({
      text: message.content[0],
      isGpt: message.role === 'assistant' ? true : false,
    }));
    setMessages([INITIAL_MESSAGE, ...newMessages]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          {/* <GptMessage text="Buen día, soy Roy, ¿en qué puedo ayudarte?" /> */}

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
        onSendMessage={handlePost}
        isLoading={isLoading || !threadId}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
