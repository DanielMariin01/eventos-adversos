import{c as I}from"./AuthenticatedLayout-DcW0KiIN.js";import{f as D}from"./app-CwAchwxf.js";/**
 * @license lucide-react v1.18.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],B=I("circle-check-big",L);var w={exports:{}},R={},_={exports:{}},V={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W;function M(){if(W)return V;W=1;var n=D();function S(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var m=typeof Object.is=="function"?Object.is:S,h=n.useState,p=n.useEffect,y=n.useLayoutEffect,E=n.useDebugValue;function b(e,r){var u=r(),o=h({inst:{value:u,getSnapshot:r}}),t=o[0].inst,f=o[1];return y(function(){t.value=u,t.getSnapshot=r,l(t)&&f({inst:t})},[e,u,r]),p(function(){return l(t)&&f({inst:t}),e(function(){l(t)&&f({inst:t})})},[e]),E(u),u}function l(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!m(e,u)}catch{return!0}}function i(e,r){return r()}var c=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?i:b;return V.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:c,V}var g;function O(){return g||(g=1,_.exports=M()),_.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z;function U(){if(z)return R;z=1;var n=D(),S=O();function m(i,c){return i===c&&(i!==0||1/i===1/c)||i!==i&&c!==c}var h=typeof Object.is=="function"?Object.is:m,p=S.useSyncExternalStore,y=n.useRef,E=n.useEffect,b=n.useMemo,l=n.useDebugValue;return R.useSyncExternalStoreWithSelector=function(i,c,e,r,u){var o=y(null);if(o.current===null){var t={hasValue:!1,value:null};o.current=t}else t=o.current;o=b(function(){function j(a){if(!x){if(x=!0,d=a,a=r(a),u!==void 0&&t.hasValue){var s=t.value;if(u(s,a))return v=s}return v=a}if(s=v,h(d,a))return s;var q=r(a);return u!==void 0&&u(s,q)?(d=a,s):(d=a,v=q)}var x=!1,d,v,k=e===void 0?null:e;return[function(){return j(c())},k===null?void 0:function(){return j(k())}]},[c,e,r,u]);var f=p(i,o[0],o[1]);return E(function(){t.hasValue=!0,t.value=f},[f]),l(f),f},R}var C;function G(){return C||(C=1,w.exports=U()),w.exports}var N=G();export{B as C,O as r,N as w};
