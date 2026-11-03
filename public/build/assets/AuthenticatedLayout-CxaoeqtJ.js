import{r as n,j as e,L as x,c as y}from"./app-BYG4nMwD.js";import{A as f}from"./ApplicationLogo-BVsJhNH1.js";import{e as L}from"./transition-RmdGjTI0.js";const p=n.createContext(),d=({children:t})=>{const[s,r]=n.useState(!1),a=()=>{r(l=>!l)};return e.jsx(p.Provider,{value:{open:s,setOpen:r,toggleOpen:a},children:e.jsx("div",{className:"relative",children:t})})},$=({children:t})=>{const{open:s,setOpen:r,toggleOpen:a}=n.useContext(p);return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:a,children:t}),s&&e.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>r(!1)})]})},A=({align:t="right",width:s="48",contentClasses:r="py-1 bg-white",children:a})=>{const{open:l,setOpen:o}=n.useContext(p);let h="origin-top";t==="left"?h="ltr:origin-top-left rtl:origin-top-right start-0":t==="right"&&(h="ltr:origin-top-right rtl:origin-top-left end-0");let i="";return s==="48"&&(i="w-48"),e.jsx(e.Fragment,{children:e.jsx(L,{show:l,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${h} ${i}`,onClick:()=>o(!1),children:e.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+r,children:a})})})})},z=({className:t="",children:s,...r})=>e.jsx(x,{...r,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none "+t,children:s});d.Trigger=$;d.Content=A;d.Link=z;/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=(...t)=>t.filter((s,r,a)=>!!s&&s.trim()!==""&&a.indexOf(s)===r).join(" ").trim();/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(s,r,a)=>a?a.toUpperCase():r.toLowerCase());/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=t=>{const s=H(t);return s.charAt(0).toUpperCase()+s.slice(1)};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var m={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=t=>{for(const s in t)if(s.startsWith("aria-")||s==="role"||s==="title")return!0;return!1},O=n.createContext({}),P=()=>n.useContext(O),W=n.forwardRef(({color:t,size:s,strokeWidth:r,absoluteStrokeWidth:a,className:l="",children:o,iconNode:h,...i},b)=>{const{size:u=24,strokeWidth:g=2,absoluteStrokeWidth:v=!1,color:w="currentColor",className:C=""}=P()??{},N=a??v?Number(r??g)*24/Number(s??u):r??g;return n.createElement("svg",{ref:b,...m,width:s??u??m.width,height:s??u??m.height,stroke:t??w,strokeWidth:N,className:j("lucide",C,l),...!o&&!S(i)&&{"aria-hidden":"true"},...i},[...h.map(([M,_])=>n.createElement(M,_)),...Array.isArray(o)?o:[o]])});/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=(t,s)=>{const r=n.forwardRef(({className:a,...l},o)=>n.createElement(W,{ref:o,iconNode:s,className:j(`lucide-${E(k(t))}`,`lucide-${t}`,a),...l}));return r.displayName=k(t),r};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],F=c("circle-x",D);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]],R=c("clipboard-check",T);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],q=c("clipboard-list",U);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],B=c("file-text",V);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],K=c("layout-dashboard",I);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Z=c("log-out",X);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],J=c("map-pin",G);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Y=c("menu",Q);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],te=c("users",ee);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],re=c("x",se);function ne({header:t,children:s}){const r=y().props.auth.user,a=y().props.auth.rol,[l,o]=n.useState(!1),h=[{title:"Dashboard",url:route("dashboard"),icon:K,roles:["administrador","calidad"]},{title:"Áreas",url:route("areas.index"),icon:J,roles:["administrador"]},{title:"Usuarios",url:route("usuarios.index"),icon:te,roles:["administrador"]},{title:"Eventos Adversos",url:route("eventos.index"),icon:B,roles:["administrador","calidad"]},{title:"Planes de Mejora",url:route("mejoras.index"),icon:R,roles:["administrador","calidad"]},{title:"Mis Eventos",url:route("eventos.mis"),icon:q,roles:["jefe","administrador"]},{title:"Eventos Cancelados",url:route("eventos.cancelados"),icon:F,roles:["administrador","calidad"]}];return e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[l&&e.jsx("div",{className:"fixed inset-0 bg-black/50 z-30",onClick:()=>o(!1)}),e.jsxs("div",{className:`fixed inset-y-0 left-0 z-40 w-64 bg-ink text-white transform transition-transform duration-300 ease-in-out ${l?"translate-x-0":"-translate-x-full"}`,children:[e.jsxs("div",{className:"relative flex items-center justify-center p-4 border-b border-gray-700",children:[e.jsx(x,{href:route("dashboard"),children:e.jsx(f,{className:"h-14 w-auto"})}),e.jsx("button",{onClick:()=>o(!1),className:"absolute right-4 text-gray-400 hover:text-white",children:e.jsx(re,{className:"w-5 h-5"})})]}),e.jsx("nav",{className:"p-4 space-y-1",children:h.filter(i=>i.roles.includes(a)).map(i=>e.jsxs(x,{href:i.url,onClick:()=>o(!1),className:"flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition",children:[e.jsx(i.icon,{className:"w-5 h-5"}),e.jsx("span",{className:"text-sm font-medium",children:i.title})]},i.title))}),e.jsxs("div",{className:"absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700",children:[e.jsx("div",{className:"text-xs text-gray-400 mb-3",children:r.name}),e.jsxs(x,{href:route("logout"),method:"post",as:"button",className:"flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition",children:[e.jsx(Z,{className:"w-4 h-4"}),"Cerrar sesión"]})]})]}),e.jsx("nav",{className:"bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20",children:e.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex h-20 items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("button",{onClick:()=>o(!0),className:"text-gray-500 hover:text-gray-700 transition",children:e.jsx(Y,{className:"w-6 h-6"})}),e.jsx(x,{href:route("dashboard"),children:e.jsx(f,{className:"h-14 w-auto"})})]}),e.jsx("div",{className:"flex items-center",children:e.jsxs(d,{children:[e.jsx(d.Trigger,{children:e.jsxs("button",{className:"flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900",children:[e.jsx("img",{src:`https://api.dicebear.com/7.x/initials/svg?seed=${r.name}`,alt:r.name,className:"w-8 h-8 rounded-full"}),r.name,e.jsx("svg",{className:"w-4 h-4",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})}),e.jsxs(d.Content,{children:[e.jsx(d.Link,{href:route("profile.edit"),children:"Perfil"}),e.jsx(d.Link,{href:route("logout"),method:"post",as:"button",children:"Cerrar sesión"})]})]})})]})})}),t&&e.jsx("header",{className:"bg-primary-600 shadow",children:e.jsx("div",{className:"mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8",children:t})}),e.jsx("main",{children:s})]})}export{ne as A,F as C,B as F,J as M,te as U,re as X,q as a,c};
