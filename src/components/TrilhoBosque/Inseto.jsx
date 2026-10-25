export default function Inseto({ id }) {
  return (
    <svg viewBox="0 0 64 48" width="56" height="44" focusable="false">
      <defs>
        <linearGradient id={`asa-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ff8b58" />
          <stop offset=".55" stopColor="#ef493c" />
          <stop offset="1" stopColor="#ce302e" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="#344535" strokeWidth="2.3" strokeLinecap="round">
        <g className="pernas-a">
          <path d="m22 15-6-5-5 2m23 3 3-6 5-1m-14 25-2 7-6 2" />
        </g>

        <g className="pernas-b">
          <path d="m21 23-9 1-4 4m14 3-7 5-1 5m23-7 5 6 5-1" />
        </g>
      </g>

      <ellipse cx="31" cy="25" rx="18" ry="16" fill="#334537" />

      <ellipse cx="48" cy="24" rx="10" ry="11" fill="#344535" />

      <path
        d="M49 14q3-8 8-7m-6 28q5 7 9 4"
        fill="none"
        stroke="#344535"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <ellipse
        cx="30"
        cy="24"
        rx="17"
        ry="15"
        fill={`url(#asa-${id})`}
        stroke="#aa3930"
        strokeWidth="1.3"
      />

      <path d="M14 24H46" stroke="#993d32" strokeWidth="1.7" />

      <g fill="#344535">
        <circle cx="25" cy="16" r="3.3" />
        <circle cx="37" cy="18" r="2.8" />
        <circle cx="23" cy="31" r="3.2" />
        <circle cx="35" cy="31" r="3.1" />
        <circle cx="17" cy="24" r="2.4" />
      </g>

      <ellipse cx="25" cy="12" rx="5" ry="1.7" fill="#ffd49b" opacity=".7" />

      <circle cx="53" cy="19" r="3.5" fill="#fff9dc" />

      <circle cx="54" cy="19" r="1.7" fill="#344535" />

      <path
        d="M52 29q3 2 5-1"
        fill="none"
        stroke="#fff3c4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
