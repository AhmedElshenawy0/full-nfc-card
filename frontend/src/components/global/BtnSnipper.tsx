const BtnSnipper = () => (
  <div className="flex justify-center items-center gap-[3px] h-6">
    {[0, 150, 300, 450].map((delay, i) => (
      <span
        key={i}
        className="block w-1 h-full bg-[#534AB7] rounded-sm"
        style={{ animation: `bars 0.9s ease-in-out ${delay}ms infinite` }}
      />
    ))}
  </div>
);
/* Add to your CSS: 
@keyframes bars {
  0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
  50%       { transform: scaleY(1);   opacity: 1;   }
} */

export default BtnSnipper;
