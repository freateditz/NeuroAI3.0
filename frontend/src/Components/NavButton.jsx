const NavButton = ({ text, onClickHandler }) => {
  return (
    <button
      className="px-5 py-2.5 rounded-xl border border-white/8 text-white/50 font-inter text-sm hover:bg-white/5 hover:text-white/70 transition-all"
      onClick={onClickHandler}
    >
      {text}
    </button>
  );
};
export default NavButton;
