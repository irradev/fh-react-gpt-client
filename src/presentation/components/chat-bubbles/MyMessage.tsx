interface Props {
  text: string;
  file?: File;
}

export const MyMessage = ({ text, file }: Props) => {
  console.log(file);
  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          U
        </div>
        <div className="relative mr-3 text-md bg-indigo-700 py-2 px-4 shadow rounded-xl">
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="File"
            />
          )}

          <div>{text}</div>
        </div>
      </div>
    </div>
  );
};
