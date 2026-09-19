const RecordButton = ({ bgColor, text, textColor, onClickHandler }) => {
  return (
    <button
      className="text-white rounded-xl px-5 py-2.5 font-inter text-sm hover:opacity-80 transition-all"
      style={{ backgroundColor: bgColor, color: textColor || 'white' }}
      onClick={onClickHandler}
    >
      {text}
    </button>
  );
};
export default RecordButton;
