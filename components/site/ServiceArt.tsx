// Animated service illustrations (CSS keyframes in globals.css). Remounting one (new key) replays its build.
/* eslint-disable react/no-unknown-property */

import type React from "react";

type ArtProps = { cls: string };

export function WebsiteArt({ cls }: ArtProps) {
  return (
    <svg className={cls} viewBox="0 0 400 500" role="img" aria-label="A business website assembling: header, hero, feature cards">
      <g className="b" style={{ "--d": 0 } as React.CSSProperties}>
      <rect x="40" y="56" width="320" height="388" rx="14" fill="#f7f3ea" stroke="#15130f" strokeWidth="1.5"/>
      <line x1="40" y1="90" x2="360" y2="90" stroke="#15130f" strokeOpacity=".15"/>
      <circle cx="60" cy="73" r="4" fill="#15130f" opacity=".25"/><circle cx="74" cy="73" r="4" fill="#15130f" opacity=".25"/><circle cx="88" cy="73" r="4" fill="#15130f" opacity=".25"/>
      <rect x="110" y="66" width="180" height="14" rx="7" fill="#e7e1d4"/>
      <text x="122" y="76" fontSize="8" fill="#5f5a53" className="mono">yourbusiness.com</text>
      </g>
      <g className="b" style={{ "--d": .25 } as React.CSSProperties}>
      <rect x="60" y="108" width="46" height="10" rx="2" fill="#15130f"/>
      <rect x="206" y="111" width="22" height="4" rx="2" fill="#15130f" opacity=".4"/><rect x="236" y="111" width="22" height="4" rx="2" fill="#15130f" opacity=".4"/><rect x="266" y="111" width="22" height="4" rx="2" fill="#15130f" opacity=".4"/>
      <rect x="298" y="106" width="42" height="14" rx="7" fill="#b39a70"/>
      </g>
      <rect className="gy" style={{ "--d": .45 } as React.CSSProperties} x="60" y="134" width="280" height="134" rx="10" fill="#15130f"/>
      <g className="b" style={{ "--d": 1 } as React.CSSProperties}>
      <rect x="80" y="162" width="150" height="16" rx="3" fill="#b39a70"/>
      <rect x="80" y="186" width="110" height="16" rx="3" fill="#b39a70" opacity=".6"/>
      <rect x="80" y="214" width="170" height="5" rx="2" fill="#f7f3ea" opacity=".35"/>
      <rect x="80" y="224" width="130" height="5" rx="2" fill="#f7f3ea" opacity=".35"/>
      </g>
      <g className="b" style={{ "--d": 1.2 } as React.CSSProperties}>
      <rect x="80" y="240" width="76" height="18" rx="9" fill="#f7f3ea"/>
      <text x="118" y="252.5" fontSize="8" fill="#15130f" textAnchor="middle" fontWeight="500">Get a quote</text>
      </g>
      <g className="b" style={{ "--d": 1.1 } as React.CSSProperties}><circle className="pulse" cx="292" cy="200" r="34" fill="none" stroke="#b39a70" strokeOpacity=".6" strokeWidth="1.5"/><circle cx="292" cy="200" r="16" fill="#b39a70" opacity=".35"/></g>
      <g className="b" style={{ "--d": 1.35 } as React.CSSProperties}><rect x="60" y="284" width="88" height="86" rx="8" fill="#fff" stroke="#15130f" strokeOpacity=".14"/><circle cx="80" cy="304" r="8" fill="#b39a70" opacity=".7"/><rect x="72" y="324" width="58" height="5" rx="2" fill="#15130f" opacity=".7"/><rect x="72" y="336" width="42" height="5" rx="2" fill="#15130f" opacity=".3"/></g>
      <g className="b" style={{ "--d": 1.5 } as React.CSSProperties}><rect x="156" y="284" width="88" height="86" rx="8" fill="#fff" stroke="#15130f" strokeOpacity=".14"/><circle cx="176" cy="304" r="8" fill="#b39a70" opacity=".7"/><rect x="168" y="324" width="58" height="5" rx="2" fill="#15130f" opacity=".7"/><rect x="168" y="336" width="42" height="5" rx="2" fill="#15130f" opacity=".3"/></g>
      <g className="b" style={{ "--d": 1.65 } as React.CSSProperties}><rect x="252" y="284" width="88" height="86" rx="8" fill="#fff" stroke="#15130f" strokeOpacity=".14"/><circle cx="272" cy="304" r="8" fill="#b39a70" opacity=".7"/><rect x="264" y="324" width="58" height="5" rx="2" fill="#15130f" opacity=".7"/><rect x="264" y="336" width="42" height="5" rx="2" fill="#15130f" opacity=".3"/></g>
      <g className="b" style={{ "--d": 1.85 } as React.CSSProperties}><rect x="60" y="388" width="180" height="5" rx="2" fill="#15130f" opacity=".2"/><rect x="60" y="400" width="130" height="5" rx="2" fill="#15130f" opacity=".2"/><rect x="60" y="418" width="280" height="1" fill="#15130f" opacity=".12"/></g>
      <circle className="ripple rm-hide" cx="144" cy="251" r="10" fill="#b39a70"/>
      <g className="cursor" transform="translate(142 250)"><path d="M0 0v17l4.5-4 3.2 7 3-1.3-3.2-6.8H13z" fill="#15130f" stroke="#f7f3ea" strokeWidth="1.2" strokeLinejoin="round"/></g>
      </svg>
  );
}

export function StoreArt({ cls }: ArtProps) {
  return (
    <svg className={cls} viewBox="0 0 400 500" role="img" aria-label="An online store: a product is added to the cart and checkout completes">
      <g className="b" style={{ "--d": 0 } as React.CSSProperties}>
      <text x="50" y="72" fontSize="11" fill="#15130f" className="mono">STORE</text>
      <rect x="50" y="84" width="300" height="1" fill="#15130f" opacity=".14"/>
      <path d="M318 58h5l4 16h16l3-11h-21" fill="none" stroke="#15130f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="329" cy="79" r="2" fill="#15130f"/><circle cx="341" cy="79" r="2" fill="#15130f"/>
      </g>
      <g className="pop" style={{ "--d": 2.75 } as React.CSSProperties}><circle cx="348" cy="56" r="8" fill="#b39a70"/><text x="348" y="59.5" fontSize="9" fill="#15130f" textAnchor="middle" fontWeight="500">1</text></g>
      <g className="b" style={{ "--d": .2 } as React.CSSProperties}><rect x="50" y="102" width="142" height="146" rx="10" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><rect x="60" y="112" width="122" height="78" rx="6" fill="#efe9dd"/><rect x="108" y="124" width="26" height="54" rx="8" fill="#15130f"/><rect x="114" y="118" width="14" height="10" rx="2" fill="#b39a70"/><rect x="60" y="202" width="70" height="6" rx="2" fill="#15130f" opacity=".7"/><text x="60" y="230" fontSize="11" fill="#15130f">₹1,499</text><circle className="pulse" cx="170" cy="226" r="11" fill="#15130f"/><path d="M165 226h10M170 221v10" stroke="#f7f3ea" strokeWidth="1.6" strokeLinecap="round"/></g>
      <g className="b" style={{ "--d": .35 } as React.CSSProperties}><rect x="208" y="102" width="142" height="146" rx="10" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><rect x="218" y="112" width="122" height="78" rx="6" fill="#efe9dd"/><circle cx="279" cy="151" r="24" fill="none" stroke="#15130f" strokeWidth="6"/><circle cx="279" cy="151" r="9" fill="#b39a70"/><rect x="218" y="202" width="62" height="6" rx="2" fill="#15130f" opacity=".7"/><text x="218" y="230" fontSize="11" fill="#15130f">₹2,299</text><circle cx="328" cy="226" r="11" fill="none" stroke="#15130f" strokeOpacity=".4"/><path d="M323 226h10M328 221v10" stroke="#15130f" strokeWidth="1.6" strokeLinecap="round" opacity=".6"/></g>
      <g className="b" style={{ "--d": .5 } as React.CSSProperties}><rect x="50" y="262" width="142" height="146" rx="10" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><rect x="60" y="272" width="122" height="78" rx="6" fill="#efe9dd"/><path d="M90 336l31-48 31 48z" fill="#b39a70"/><rect x="60" y="362" width="58" height="6" rx="2" fill="#15130f" opacity=".7"/><text x="60" y="390" fontSize="11" fill="#15130f">₹899</text><circle cx="170" cy="386" r="11" fill="none" stroke="#15130f" strokeOpacity=".4"/><path d="M165 386h10M170 381v10" stroke="#15130f" strokeWidth="1.6" strokeLinecap="round" opacity=".6"/></g>
      <g className="b" style={{ "--d": .65 } as React.CSSProperties}><rect x="208" y="262" width="142" height="146" rx="10" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><rect x="218" y="272" width="122" height="78" rx="6" fill="#efe9dd"/><rect x="259" y="290" width="40" height="40" rx="4" fill="#15130f" transform="rotate(45 279 310)"/><rect x="218" y="362" width="66" height="6" rx="2" fill="#15130f" opacity=".7"/><text x="218" y="390" fontSize="11" fill="#15130f">₹3,150</text><circle cx="328" cy="386" r="11" fill="none" stroke="#15130f" strokeOpacity=".4"/><path d="M323 386h10M328 381v10" stroke="#15130f" strokeWidth="1.6" strokeLinecap="round" opacity=".6"/></g>
      <rect className="fly rm-hide" x="108" y="138" width="26" height="26" rx="6" fill="#b39a70"/>
      <g className="b" style={{ "--d": .8 } as React.CSSProperties}><rect x="50" y="440" width="300" height="4" rx="2" fill="#15130f" opacity=".12"/></g>
      <rect className="gx" style={{ "--d": 3.1, "--t": "1.6s" } as React.CSSProperties} x="50" y="440" width="300" height="4" rx="2" fill="#15130f"/>
      <g className="pop" style={{ "--d": 3.1 } as React.CSSProperties}><circle cx="54" cy="442" r="7" fill="#15130f"/></g>
      <g className="pop" style={{ "--d": 3.85 } as React.CSSProperties}><circle cx="200" cy="442" r="7" fill="#15130f"/></g>
      <g className="pop" style={{ "--d": 4.6 } as React.CSSProperties}><circle cx="346" cy="442" r="9" fill="#b39a70"/><path d="M342 442l3 3 5-6" fill="none" stroke="#15130f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></g>
      <g className="b" style={{ "--d": .9 } as React.CSSProperties} fontSize="9" fill="#5f5a53"><text x="50" y="470" className="mono">CART</text><text x="200" y="470" textAnchor="middle" className="mono">PAY</text><text x="350" y="470" textAnchor="end" className="mono">DONE</text></g>
      </svg>
  );
}

export function SpeedArt({ cls }: ArtProps) {
  return (
    <svg className={cls} viewBox="0 0 400 500" role="img" aria-label="A performance score of 98 with Core Web Vitals and a rising search traffic line">
      <text className="b mono" style={{ "--d": 0 } as React.CSSProperties} x="50" y="56" fontSize="10" fill="#5f5a53">PAGESPEED</text>
      <circle cx="200" cy="168" r="88" fill="none" stroke="#15130f" strokeOpacity=".1" strokeWidth="14"/>
      <circle className="gauge" cx="200" cy="168" r="88" fill="none" stroke="#15130f" strokeWidth="14" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="2" transform="rotate(-90 200 168)"/>
      <circle className="halo" style={{ "--d": 2.2 } as React.CSSProperties} cx="200" cy="80" r="7" fill="#b39a70"/>
      <circle cx="200" cy="80" r="5" fill="#b39a70"/>
      <text x="200" y="186" fontSize="64" fill="#15130f" textAnchor="middle" style={{ fontFamily: "var(--serif)" }} data-to="98">98</text>
      <text className="b mono" style={{ "--d": 1.4 } as React.CSSProperties} x="200" y="214" fontSize="9" fill="#5f5a53" textAnchor="middle">PERFORMANCE</text>
      <g className="b" style={{ "--d": 1.7 } as React.CSSProperties}><rect x="50" y="282" width="92" height="46" rx="23" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><circle cx="70" cy="305" r="4" fill="#b39a70"/><text x="82" y="300" fontSize="8" fill="#5f5a53" className="mono">LCP</text><text x="82" y="315" fontSize="13" fill="#15130f">1.2s</text></g>
      <g className="b" style={{ "--d": 1.85 } as React.CSSProperties}><rect x="154" y="282" width="92" height="46" rx="23" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><circle cx="174" cy="305" r="4" fill="#b39a70"/><text x="186" y="300" fontSize="8" fill="#5f5a53" className="mono">CLS</text><text x="186" y="315" fontSize="13" fill="#15130f">0.01</text></g>
      <g className="b" style={{ "--d": 2 } as React.CSSProperties}><rect x="258" y="282" width="92" height="46" rx="23" fill="#fff" stroke="#15130f" strokeOpacity=".12"/><circle cx="278" cy="305" r="4" fill="#b39a70"/><text x="290" y="300" fontSize="8" fill="#5f5a53" className="mono">INP</text><text x="290" y="315" fontSize="13" fill="#15130f">80ms</text></g>
      <g className="b" style={{ "--d": 2.1 } as React.CSSProperties}><text x="50" y="364" fontSize="9" fill="#5f5a53" className="mono">ORGANIC CLICKS ↑</text><line x1="50" y1="460" x2="350" y2="460" stroke="#15130f" strokeOpacity=".25"/><line x1="50" y1="425" x2="350" y2="425" stroke="#15130f" strokeOpacity=".1" strokeDasharray="3 4"/><line x1="50" y1="390" x2="350" y2="390" stroke="#15130f" strokeOpacity=".1" strokeDasharray="3 4"/></g>
      <path className="b" style={{ "--d": 3.2 } as React.CSSProperties} d="M50 452L100 446 150 440 200 427 250 418 300 398 350 378V460H50z" fill="#b39a70" opacity=".25"/>
      <path className="draw" style={{ "--d": 2.3 } as React.CSSProperties} d="M50 452L100 446 150 440 200 427 250 418 300 398 350 378" fill="none" stroke="#15130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1"/>
      <circle className="halo" style={{ "--d": 3.9 } as React.CSSProperties} cx="350" cy="378" r="5" fill="#b39a70"/>
      <circle className="pop" style={{ "--d": 3.8 } as React.CSSProperties} cx="350" cy="378" r="5" fill="#15130f"/>
      </svg>
  );
}

export function AiArt({ cls }: ArtProps) {
  return (
    <svg className={cls} viewBox="0 0 400 500" role="img" aria-label="An AI assistant connected to site data, answering a customer question">
      <g stroke="#15130f" strokeOpacity=".4" strokeWidth="1.4" strokeDasharray="3 5" className="b" style={{ "--d": .2 } as React.CSSProperties}>
      <line className="flow" x1="200" y1="132" x2="290" y2="132"/><line className="flow" x1="200" y1="132" x2="245" y2="54"/><line className="flow" x1="200" y1="132" x2="155" y2="54"/><line className="flow" x1="200" y1="132" x2="110" y2="132"/><line className="flow" x1="200" y1="132" x2="155" y2="210"/><line className="flow" x1="200" y1="132" x2="245" y2="210"/>
      </g>
      <circle className="b" style={{ "--d": .3 } as React.CSSProperties} cx="290" cy="132" r="9" fill="#f7f3ea" stroke="#15130f" strokeWidth="1.4"/>
      <circle className="b" style={{ "--d": .4 } as React.CSSProperties} cx="245" cy="54" r="9" fill="#f7f3ea" stroke="#15130f" strokeWidth="1.4"/>
      <circle className="b" style={{ "--d": .5 } as React.CSSProperties} cx="155" cy="54" r="9" fill="#b39a70"/>
      <circle className="b" style={{ "--d": .6 } as React.CSSProperties} cx="110" cy="132" r="9" fill="#f7f3ea" stroke="#15130f" strokeWidth="1.4"/>
      <circle className="b" style={{ "--d": .7 } as React.CSSProperties} cx="155" cy="210" r="9" fill="#f7f3ea" stroke="#15130f" strokeWidth="1.4"/>
      <circle className="b" style={{ "--d": .8 } as React.CSSProperties} cx="245" cy="210" r="9" fill="#b39a70"/>
      <circle className="halo" cx="200" cy="132" r="28" fill="#b39a70"/>
      <g className="pop" style={{ "--d": 0 } as React.CSSProperties}><circle cx="200" cy="132" r="28" fill="#15130f"/><path d="M200 116c1.6 9 6 13.4 15 16-9 2.6-13.4 7-15 16-1.6-9-6-13.4-15-16 9-2.6 13.4-7 15-16z" fill="#b39a70"/></g>
      <g className="b" style={{ "--d": .6 } as React.CSSProperties}>
      <rect x="50" y="252" width="300" height="208" rx="14" fill="#f7f3ea" stroke="#15130f" strokeOpacity=".15"/>
      <circle cx="70" cy="276" r="4" fill="#6fcf7c"/><text x="82" y="279.5" fontSize="9" fill="#5f5a53" className="mono">ASSISTANT</text>
      <line x1="50" y1="292" x2="350" y2="292" stroke="#15130f" strokeOpacity=".1"/>
      </g>
      <g className="b" style={{ "--d": 1.1 } as React.CSSProperties}><rect x="174" y="306" width="158" height="32" rx="14" fill="#15130f"/><text x="188" y="326" fontSize="11" fill="#f7f3ea">Do you deliver to Pune?</text></g>
      <g className="blink rm-hide" style={{ "--d": 1.7 } as React.CSSProperties}><rect x="68" y="352" width="54" height="28" rx="14" fill="#fff" stroke="#15130f" strokeOpacity=".15"/><circle className="dot3" cx="84" cy="366" r="3" fill="#15130f"/><circle className="dot3" style={{ "--d": .15 } as React.CSSProperties} cx="95" cy="366" r="3" fill="#15130f"/><circle className="dot3" style={{ "--d": .3 } as React.CSSProperties} cx="106" cy="366" r="3" fill="#15130f"/></g>
      <g className="b" style={{ "--d": 3 } as React.CSSProperties}><rect x="68" y="352" width="200" height="48" rx="14" fill="#fff" stroke="#15130f" strokeOpacity=".15"/><text x="82" y="372" fontSize="11" fill="#15130f">Yes! Next-day delivery</text><text x="82" y="388" fontSize="11" fill="#15130f">across Pune. Want a quote?</text></g>
      <g className="b" style={{ "--d": 3.4 } as React.CSSProperties}><rect x="68" y="414" width="86" height="26" rx="13" fill="none" stroke="#15130f" strokeOpacity=".5"/><text x="111" y="430.5" fontSize="10" fill="#15130f" textAnchor="middle">Get a quote</text></g>
      <g className="b" style={{ "--d": 3.55 } as React.CSSProperties}><rect x="162" y="414" width="90" height="26" rx="13" fill="none" stroke="#15130f" strokeOpacity=".5"/><text x="207" y="430.5" fontSize="10" fill="#15130f" textAnchor="middle">Track order</text></g>
      </svg>
  );
}

export const SERVICE_ARTS = [WebsiteArt, StoreArt, SpeedArt, AiArt];
