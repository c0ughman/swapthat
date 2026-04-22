export default function WorkoutPersonSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a person celebrating after a workout"
    >
      {/* ─── Stars / Sparkles ─── */}
      <path d="M52 108L56 124L72 128L56 132L52 148L48 132L32 128L48 124Z" fill="white" opacity="0.55" />
      <path d="M308 72L311 83L322 86L311 89L308 100L305 89L294 86L305 83Z" fill="white" opacity="0.5" />
      <path d="M40 280L43 290L53 293L43 296L40 306L37 296L27 293L37 290Z" fill="white" opacity="0.4" />
      <path d="M320 230L322 238L330 240L322 242L320 250L318 242L310 240L318 238Z" fill="white" opacity="0.5" />
      <circle cx="295" cy="155" r="6" fill="white" opacity="0.3" />
      <circle cx="66" cy="340" r="5" fill="white" opacity="0.25" />
      <circle cx="315" cy="340" r="4" fill="white" opacity="0.2" />

      {/* ─── Sweat drops ─── */}
      <path d="M325 190 Q330 180 335 190 Q333 205 325 205 Q317 205 315 190 Q320 180 325 190Z" fill="white" opacity="0.25" />
      <path d="M343 225 Q347 217 351 225 Q349 235 343 235 Q337 235 335 225 Q339 217 343 225Z" fill="white" opacity="0.18" />

      {/* ─── LEFT ARM ─── */}
      <path
        d="M148 248 C138 228 120 202 98 172 C90 160 82 148 88 136 C94 124 108 126 118 138 C130 154 144 180 153 212 Z"
        fill="white"
        opacity="0.92"
      />
      {/* Left hand */}
      <ellipse cx="88" cy="134" rx="20" ry="22" fill="white" />
      {/* Thumb */}
      <ellipse cx="71" cy="130" rx="8" ry="12" fill="white" transform="rotate(-20 71 130)" />

      {/* ─── RIGHT ARM ─── */}
      <path
        d="M212 248 C222 228 240 202 262 172 C270 160 278 148 272 136 C266 124 252 126 242 138 C230 154 216 180 207 212 Z"
        fill="white"
        opacity="0.92"
      />
      {/* Right hand */}
      <ellipse cx="272" cy="134" rx="20" ry="22" fill="white" />
      {/* Thumb */}
      <ellipse cx="289" cy="130" rx="8" ry="12" fill="white" transform="rotate(20 289 130)" />
      {/* Mini dumbbell in right hand */}
      <rect x="262" y="124" width="7" height="7" rx="3.5" fill="rgba(79,70,229,0.45)" />
      <rect x="264" y="131" width="3" height="14" fill="rgba(79,70,229,0.3)" />
      <rect x="262" y="145" width="7" height="7" rx="3.5" fill="rgba(79,70,229,0.45)" />

      {/* ─── BODY / Workout outfit ─── */}
      <path
        d="M150 235 C132 242 120 262 118 298 C116 335 122 362 158 374 C178 381 202 381 222 374 C258 362 264 335 262 298 C260 262 248 242 230 235 C218 228 210 224 180 224 C150 224 162 228 150 235Z"
        fill="white"
      />
      {/* Sports bra / crop top detail */}
      <path
        d="M162 242 C172 254 208 254 218 242 C215 265 207 272 180 273 C153 272 145 265 162 242Z"
        fill="rgba(99,102,241,0.12)"
      />
      {/* Side accent stripes */}
      <path d="M121 290 Q118 270 122 255" stroke="rgba(99,102,241,0.12)" strokeWidth="6" strokeLinecap="round" />
      <path d="M239 290 Q242 270 238 255" stroke="rgba(99,102,241,0.12)" strokeWidth="6" strokeLinecap="round" />

      {/* ─── NECK ─── */}
      <ellipse cx="180" cy="208" rx="18" ry="26" fill="white" />

      {/* ─── HEAD ─── */}
      <circle cx="180" cy="138" r="72" fill="white" />

      {/* ─── HAIR ─── */}
      {/* Back hair */}
      <path
        d="M118 140 Q115 90 150 68 Q165 60 180 58 Q195 60 210 68 Q245 90 242 140 Q238 110 225 95 Q208 80 190 76 Q180 74 170 76 Q152 80 135 95 Q122 110 118 140Z"
        fill="rgba(230,190,110,0.75)"
      />
      {/* Side hair bits */}
      <path d="M115 160 Q108 145 114 130" stroke="rgba(230,190,110,0.7)" strokeWidth="10" strokeLinecap="round" />
      <path d="M245 160 Q252 145 246 130" stroke="rgba(230,190,110,0.7)" strokeWidth="10" strokeLinecap="round" />

      {/* ─── EARS ─── */}
      <ellipse cx="110" cy="140" rx="10" ry="14" fill="white" />
      <ellipse cx="250" cy="140" rx="10" ry="14" fill="white" />

      {/* ─── FACE ─── */}
      {/* Eyes */}
      <ellipse cx="158" cy="130" rx="12" ry="14" fill="#4f46e5" />
      <ellipse cx="202" cy="130" rx="12" ry="14" fill="#4f46e5" />
      {/* Eye shine */}
      <ellipse cx="163" cy="125" rx="4.5" ry="5" fill="white" />
      <ellipse cx="207" cy="125" rx="4.5" ry="5" fill="white" />
      {/* Eyelashes hint */}
      <path d="M147 122 Q158 115 169 122" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M191 122 Q202 115 213 122" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M176 148 Q180 155 184 148" stroke="rgba(79,70,229,0.35)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Big smile */}
      <path d="M154 163 Q180 190 206 163" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Smile inner shadow */}
      <path d="M157 165 Q180 187 203 165 Q203 178 180 182 Q157 178 157 165Z" fill="rgba(79,70,229,0.08)" />

      {/* Rosy cheeks */}
      <ellipse cx="138" cy="158" rx="20" ry="13" fill="#e85d75" opacity="0.18" />
      <ellipse cx="222" cy="158" rx="20" ry="13" fill="#e85d75" opacity="0.18" />

      {/* ─── LEGS ─── */}
      {/* Left leg */}
      <path
        d="M155 372 C150 398 144 422 138 450 C135 460 142 468 154 468 C165 468 170 460 167 450 C165 425 165 398 168 374Z"
        fill="rgba(255,255,255,0.88)"
      />
      {/* Right leg */}
      <path
        d="M205 372 C210 398 216 422 222 450 C225 460 218 468 206 468 C195 468 190 460 193 450 C195 425 195 398 192 374Z"
        fill="rgba(255,255,255,0.88)"
      />

      {/* ─── SNEAKERS ─── */}
      {/* Left shoe */}
      <path d="M120 455 C120 445 133 440 152 442 C167 444 176 455 172 465 C168 472 120 472 120 465Z" fill="white" />
      {/* Right shoe */}
      <path d="M188 455 C188 445 193 440 208 442 C224 444 240 455 240 465 C240 472 192 472 188 465Z" fill="white" />
      {/* Sole lines */}
      <path d="M122 465 L170 465" stroke="rgba(99,102,241,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M190 465 L238 465" stroke="rgba(99,102,241,0.2)" strokeWidth="2" strokeLinecap="round" />
      {/* Shoe accent color */}
      <path d="M124 457 C128 452 138 449 148 451" stroke="rgba(99,102,241,0.25)" strokeWidth="3" strokeLinecap="round" />
      <path d="M192 457 C196 452 206 449 216 451" stroke="rgba(99,102,241,0.25)" strokeWidth="3" strokeLinecap="round" />

      {/* ─── Ground shadow ─── */}
      <ellipse cx="180" cy="488" rx="100" ry="14" fill="rgba(0,0,0,0.07)" />
    </svg>
  );
}
