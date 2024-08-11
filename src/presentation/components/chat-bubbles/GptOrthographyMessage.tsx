import { useRef, useState } from 'react';

interface Props {
  text: string;
  score: number;
  errors: {
    error: string;
    correction: string;
  }[];
}

// TODO: Crear botón compartir por...
export const GptOrthographyMessage = ({ text, score, errors }: Props) => {
  const [isCopiedText, setIsCopiedText] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const copyToClipboard = () => {
    if (!messageRef.current) return;

    const textToCopy = messageRef.current?.innerText;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopiedText(true);
        setTimeout(() => {
          setIsCopiedText(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        alert('Error al intentar copiar el texto');
      });
  };

  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg relative">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-md bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          <p ref={messageRef}>{text}</p>
          <span className="text-sm font-bold">Score:</span>
          <span className="text-sm text-green-200"> {score}%</span>
          {errors.length === 0 ? (
            <p className="mt-2">No se encontraron errores ¡perfecto!</p>
          ) : (
            <>
              <h3 className="text-sm mt-2 mb-2">
                Errores contrados:
                <span className="text-red-500"> {errors.length}</span>
              </h3>
              <ul>
                {errors.map((error, i) => (
                  <li
                    className="text-sm"
                    key={i + error.error}
                  >
                    {error.error} {'➡️'} {error.correction}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <button
        className="absolute top-3 -right-10 bg-stone-900 w-12 h-12 rounded-full "
        onClick={copyToClipboard}
      >
        <i
          className="fa-regular fa-clone"
          aria-hidden
        ></i>
      </button>

      <p
        className={`
          absolute 
          top-0 
          -right-16 
          text-sm 
          transition-all
          duration-300
          ${
            isCopiedText
              ? `
            opacity-1
            translate-y-16
          `
              : `
            opacity-0
          `
          }
        `}
      >
        ¡Texto copiado!
      </p>
    </div>
  );
};
