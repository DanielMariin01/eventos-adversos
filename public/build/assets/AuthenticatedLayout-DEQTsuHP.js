import{r as c,j as e,L as x,c as k}from"./app-BDEux4n3.js";import{A as f}from"./ApplicationLogo-Bk8MBHD3.js";import{e as $}from"./transition-4lsvt8p8.js";const y=c.createContext(),d=({children:t})=>{const[a,s]=c.useState(!1),r=()=>{s(l=>!l)};return e.jsx(y.Provider,{value:{open:a,setOpen:s,toggleOpen:r},children:e.jsx("div",{className:"relative",children:t})})},L=({children:t})=>{const{open:a,setOpen:s,toggleOpen:r}=c.useContext(y);return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:r,children:t}),a&&e.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>s(!1)})]})},A=({align:t="right",width:a="48",contentClasses:s="py-1 bg-white",children:r})=>{const{open:l,setOpen:o}=c.useContext(y);let h="origin-top";t==="left"?h="ltr:origin-top-left rtl:origin-top-right start-0":t==="right"&&(h="ltr:origin-top-right rtl:origin-top-left end-0");let n="";return a==="48"&&(n="w-48"),e.jsx(e.Fragment,{children:e.jsx($,{show:l,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${h} ${n}`,onClick:()=>o(!1),children:e.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+s,children:r})})})})},z=({className:t="",children:a,...s})=>e.jsx(x,{...s,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none "+t,children:a});d.Trigger=L;d.Content=A;d.Link=z;/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=(...t)=>t.filter((a,s,r)=>!!a&&a.trim()!==""&&r.indexOf(a)===s).join(" ").trim();/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,s,r)=>r?r.toUpperCase():s.toLowerCase());/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=t=>{const a=E(t);return a.charAt(0).toUpperCase()+a.slice(1)};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var p={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=t=>{for(const a in t)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1},S=c.createContext({}),T=()=>c.useContext(S),F=c.forwardRef(({color:t,size:a,strokeWidth:s,absoluteStrokeWidth:r,className:l="",children:o,iconNode:h,...n},u)=>{const{size:m=24,strokeWidth:g=2,absoluteStrokeWidth:b=!1,color:w="currentColor",className:C=""}=T()??{},N=r??b?Number(s??g)*24/Number(a??m):s??g;return c.createElement("svg",{ref:u,...p,width:a??m??p.width,height:a??m??p.height,stroke:t??w,strokeWidth:N,className:j("lucide",C,l),...!o&&!H(n)&&{"aria-hidden":"true"},...n},[...h.map(([M,_])=>c.createElement(M,_)),...Array.isArray(o)?o:[o]])});/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(t,a)=>{const s=c.forwardRef(({className:r,...l},o)=>c.createElement(F,{ref:o,iconNode:a,className:j(`lucide-${P(v(t))}`,`lucide-${t}`,r),...l}));return s.displayName=v(t),s};/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],W=i("circle-x",O);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]],q=i("clipboard-check",D);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],U=i("clipboard-list",R);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],B=i("cpu",V);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],I=i("file-text",Z);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],X=i("layout-dashboard",K);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],J=i("log-out",G);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],Y=i("map-pin",Q);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],te=i("menu",ee);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",key:"wa1lgi"}],["path",{d:"m8.5 8.5 7 7",key:"rvfmvr"}]],se=i("pill",ae);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["path",{d:"M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z",key:"16rjxf"}],["path",{d:"M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193",key:"178nd4"}],["circle",{cx:"10.5",cy:"6.5",r:".5",fill:"currentColor",key:"12ikhr"}]],oe=i("tags",re);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],ne=i("users",ie);/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],le=i("x",ce);function ue({header:t,children:a}){const s=k().props.auth.user,r=k().props.auth.roles??[],[l,o]=c.useState(!1),h=[{title:"Dashboard",url:route("dashboard"),icon:X,roles:["administrador","calidad"]},{title:"Categorías",url:route("categorias.index"),icon:oe,roles:["administrador"]},{title:"Áreas",url:route("areas.index"),icon:Y,roles:["administrador"]},{title:"Usuarios",url:route("usuarios.index"),icon:ne,roles:["administrador"]},{title:"Eventos Adversos",url:route("eventos.index"),icon:I,roles:["administrador","calidad","farmacovigilancia"]},{title:"Tecnovigilancia",url:route("tecnovigilancia.index"),icon:B,roles:["administrador","calidad","tecnovigilancia"]},{title:"Farmacovigilancia",url:route("farmacovigilancia.index"),icon:se,roles:["administrador","farmacovigilancia"]},{title:"Planes de Mejora",url:route("mejoras.index"),icon:q,roles:["administrador","calidad","tecnovigilancia","farmacovigilancia"]},{title:"Mis Eventos",url:route("eventos.mis"),icon:U,roles:["jefe","administrador"]},{title:"Eventos Cancelados",url:route("eventos.cancelados"),icon:W,roles:["administrador","calidad"]}];return e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[l&&e.jsx("div",{className:"fixed inset-0 bg-black/50 z-30",onClick:()=>o(!1)}),e.jsxs("div",{className:`fixed inset-y-0 left-0 z-40 w-64 bg-ink text-white transform transition-transform duration-300 ease-in-out ${l?"translate-x-0":"-translate-x-full"}`,children:[e.jsxs("div",{className:"relative flex items-center justify-center p-4 border-b border-gray-700",children:[e.jsx(x,{href:route("dashboard"),children:e.jsx(f,{className:"h-14 w-auto"})}),e.jsx("button",{onClick:()=>o(!1),className:"absolute right-4 text-gray-400 hover:text-white",children:e.jsx(le,{className:"w-5 h-5"})})]}),e.jsx("nav",{className:"p-4 space-y-1",children:h.filter(n=>n.roles.some(u=>r.includes(u))).map(n=>e.jsxs(x,{href:n.url,onClick:()=>o(!1),className:"flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition",children:[e.jsx(n.icon,{className:"w-5 h-5"}),e.jsx("span",{className:"text-sm font-medium",children:n.title})]},n.title))}),e.jsxs("div",{className:"absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700",children:[e.jsx("div",{className:"text-xs text-gray-400 mb-3",children:s.name}),e.jsxs(x,{href:route("logout"),method:"post",as:"button",className:"flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition",children:[e.jsx(J,{className:"w-4 h-4"}),"Cerrar sesión"]})]})]}),e.jsx("nav",{className:"bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20",children:e.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex h-20 items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("button",{onClick:()=>o(!0),className:"text-gray-500 hover:text-gray-700 transition",children:e.jsx(te,{className:"w-6 h-6"})}),e.jsx(x,{href:route("dashboard"),children:e.jsx(f,{className:"h-14 w-auto"})})]}),e.jsx("div",{className:"flex items-center",children:e.jsxs(d,{children:[e.jsx(d.Trigger,{children:e.jsxs("button",{className:"flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900",children:[e.jsx("img",{src:`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`,alt:s.name,className:"w-8 h-8 rounded-full"}),s.name,e.jsx("svg",{className:"w-4 h-4",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})}),e.jsxs(d.Content,{children:[e.jsx(d.Link,{href:route("profile.edit"),children:"Perfil"}),e.jsx(d.Link,{href:route("logout"),method:"post",as:"button",children:"Cerrar sesión"})]})]})})]})})}),t&&e.jsx("header",{className:"bg-primary-600 shadow",children:e.jsx("div",{className:"mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8",children:t})}),e.jsx("main",{children:a})]})}export{ue as A,W as C,I as F,Y as M,se as P,ne as U,le as X,U as a,i as c};
