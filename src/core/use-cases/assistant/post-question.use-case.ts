import { PostQuestionResponse } from '../../../interfaces';

interface Props {
  threadId: string;
  question: string;
}

const MESSAGE_ERROR = 'No se pudo realizar la petición';
export const postQuestionUseCase = async (props: Props) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/user-question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: props.threadId,
          question: props.question,
        }),
      }
    );

    if (!resp.ok) throw new Error(MESSAGE_ERROR);

    const data = (await resp.json()) as PostQuestionResponse[];

    return {
      ok: true,
      messages: data,
    };
  } catch (error) {
    console.log(error);
    throw new Error(MESSAGE_ERROR);
  }
};
