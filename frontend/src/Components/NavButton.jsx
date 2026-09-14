import Sparkle from "../assets/sparkle.png";

const NavButton = ({ text, onClickHandler, currLetter }) => {
  return (
    <button
      className="w-[9.5rem] h-[4rem] bg-[#0984E3] rounded-lg text-white drop-shadow-[1px_2px_1px_rgba(0,0,0,0.7)] hover:opacity-80 flex justify-center items-center"
      onClick={onClickHandler}
    >
      <div className="mx-1">{text}</div>
      <img src={Sparkle} className="h-[1rem]"></img>
    </button>
  );
};

export default NavButton;
