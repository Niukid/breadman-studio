export default function BmMark({
  color = "#899EAA",
  width = 19,
  className,
}: {
  color?: string;
  width?: number | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 21 33.5"
      style={{ display: "block", width, fill: color }}
      className={className}
      aria-label="Breadman"
    >
      <path d="M15.74,16.29c2.45-1.6,3.84-4.14,3.84-6.75,0-4.52-2.45-8.1-9.66-8.1H0v31.48h10.81c6.96,0,10-4.22,10-8.57,0-3.46-1.86-6.46-5.07-8.06h0ZM6.03,6.33h2.62c4.18,0,5.44,1.65,5.44,3.97,0,2.57-2.07,4.31-5.61,4.31h-2.45s0-8.27,0-8.27ZM9.16,28.02h-3.12v-9.07h3c3.63,0,5.7,1.77,5.7,4.68,0,2.36-1.27,4.39-5.57,4.39Z" />
    </svg>
  );
}
