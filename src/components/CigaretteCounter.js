import cigaretteImage from '../assets/cigarette.png';

const CigaretteCounter = ({ cigarettes, onChange }) => {
  return (
    <div className="counter">
      <img src={cigaretteImage} alt="Cigarette" className="cigarette-image" />
      <div><h2>{cigarettes} Cigarettes</h2></div>
      <div>
        <button onClick={() => onChange(1)}>+1</button>
        <button onClick={() => onChange(-1)}>-1</button>
      </div>
    </div>
  );
};

export default CigaretteCounter;