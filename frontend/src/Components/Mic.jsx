import Record from "../assets/recordMic.png";

const Mic = () => {
  return (
    <button className="mt-5 hover:scale-105">
      <img className="h-[3.5rem]" src={Record}></img>
    </button>
  );
};

export default Mic;
