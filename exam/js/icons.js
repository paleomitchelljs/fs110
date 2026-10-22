/* Icons, 24 × 24, stroked. The seven tests, the dice controls, the verdicts, and two for the method knob. */
(function () {
  'use strict';
  const s = (b) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + b + '</svg>';
  Deck.icons = {
    // the tests
    time: s('<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9"/>'),
    method: s('<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>'),
    late: s('<rect x="2.5" y="8" width="3.2" height="10" rx="1"/><rect x="7.6" y="8" width="3.2" height="10" rx="1"/><rect x="12.7" y="8" width="3.2" height="10" rx="1" class="solid"/><rect x="17.8" y="8" width="3.2" height="10" rx="1" class="solid"/><path d="M3 4.5h18"/>'),
    hard: s('<path d="M2.5 20l6.5-12 4 6.5 3-4.5 5.5 10z"/>'),
    luck: s('<rect x="4" y="4" width="16" height="16" rx="3.5"/><g class="solid"><circle cx="8.8" cy="8.8" r="1.4"/><circle cx="15.2" cy="15.2" r="1.4"/><circle cx="12" cy="12" r="1.4"/></g>'),
    chapter: s('<rect x="2.5" y="7" width="5.2" height="10" rx="1"/><rect x="9.4" y="7" width="5.2" height="10" rx="1"/><rect x="16.3" y="7" width="5.2" height="10" rx="1"/>'),
    other: s('<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>'),
    // dice controls
    deal1: s('<rect x="4" y="4" width="16" height="16" rx="3.5"/><g class="solid"><circle cx="8.8" cy="8.8" r="1.4"/><circle cx="15.2" cy="15.2" r="1.4"/><circle cx="12" cy="12" r="1.4"/></g>'),
    deal100: s('<rect x="2.5" y="8.5" width="11" height="11" rx="2.5"/><rect x="10.5" y="3.5" width="11" height="11" rx="2.5"/><g class="solid"><circle cx="16" cy="9" r="1.2"/><circle cx="6.2" cy="12.8" r="1.1"/><circle cx="9.8" cy="16.2" r="1.1"/></g>'),
    real: s('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 3.5v4h4"/>'),
    // cards
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    x: s('<path d="M6 6l12 12M18 6L6 18"/>'),
    keep: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    maybe: s('<path d="M3 12c3-5 6 5 9 0s6 5 9 0"/>'),
    // the method knob: what the exam asks for, and what they might be doing instead
    runner: s('<circle cx="15" cy="4.5" r="2"/><path d="M13.5 8.5l-3 3.5 3.5 2.5v6M10.5 12l-4 1.5M13.5 8.5l4 2.5 2.5-.5M14 14.5l4 1.5 1.5 3.5"/>'),
    people: s('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 5"/>')
  };
})();
