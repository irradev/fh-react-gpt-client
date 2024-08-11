import { FormEvent, useState } from 'react';

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  isLoading: boolean;
  isCancelable?: boolean;
  onCancel?: () => void;
}

export const TextMessageBox = ({
  onSendMessage,
  isLoading,
  isCancelable = false,
  onCancel,
  placeholder,
  disableCorrections = false,
}: Props) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;

    onSendMessage(message);
    setMessage('');
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            name="message"
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? 'true' : 'false'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="ml-4">
        {isLoading && isCancelable ? (
          <button
            className="btn-primary"
            onClick={handleCancel}
          >
            <span className="mr-2">Cancelar</span>
            <i className="fa-solid fa-square"></i>
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled={isLoading}
          >
            <span className="mr-2">Enviar</span>
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        )}
      </div>
    </form>
  );
};
