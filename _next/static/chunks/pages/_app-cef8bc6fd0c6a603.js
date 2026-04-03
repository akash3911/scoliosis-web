(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{9062:function(e,t,r){"use strict";var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},n.apply(this,arguments)},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var o=a(r(5170)),i=a(r(2725)),s=r(6619);t.default=function(e){var t=e.render,r=e.pageTitle,a=e.siteTitle,l=e.titleTemplate,u=e.description,c=e.disableCanonical,d=void 0!==c&&c,f=e.baseSiteUrl,p=e.pagePath,m=e.keywords,g=e.imageUrl,y=e.imageAlt,h=e.imageWidth,v=void 0===h?1200:h,b=e.imageHeight,w=void 0===b?630:b,x=e.locale,k=void 0===x?"en_US":x,_=e.twitter,E=a;l&&r&&r!==a&&(E=l.replace("[pageTitle]",r).replace("[siteTitle]",a));var S=p?i.default(p)?p:f+"/"+p:f,j=g&&(i.default(g)?g:f+"/"+g);return t([[o.default.createElement("title",{key:"title"},E),o.default.createElement("meta",{key:"meta:description",name:"description",content:u}),m&&o.default.createElement("meta",{key:"meta:keywords",name:"keywords",content:s.commaSeparate(m)}),!d&&o.default.createElement("link",{key:"canonical",rel:"canonical",href:S}),o.default.createElement("meta",{key:"og:type",property:"og:type",content:"website"}),o.default.createElement("meta",{key:"og:url",property:"og:url",content:S}),o.default.createElement("meta",{key:"og:title",property:"og:title",content:E}),o.default.createElement("meta",{key:"og:description",property:"og:description",content:u}),o.default.createElement("meta",{key:"og:image",property:"og:image",content:j}),o.default.createElement("meta",{key:"og:image:width",property:"og:image:width",content:v.toString()}),o.default.createElement("meta",{key:"og:image:height",property:"og:image:height",content:w.toString()}),o.default.createElement("meta",{key:"og:image:alt",property:"og:image:alt",content:y}),o.default.createElement("meta",{key:"og:site_name",property:"og:site_name",content:a}),o.default.createElement("meta",{key:"og:locale",property:"og:locale",content:k})],_&&function(e){var t=e.cardSize,r=e.title,n=e.description,a=e.siteUsername,i=e.creatorUsername,s=e.imageUrl,l=e.imageAlt;return[o.default.createElement("meta",{key:"twitter:card",name:"twitter:card",content:"large"===t?"summary_large_image":"summary"}),r&&o.default.createElement("meta",{key:"twitter:title",name:"twitter:title",content:r}),n&&o.default.createElement("meta",{key:"twitter:description",name:"twitter:description",content:n}),a&&o.default.createElement("meta",{key:"twitter:site",name:"twitter:site",content:a}),i&&o.default.createElement("meta",{key:"twitter:creator",name:"twitter:creator",content:i}),s&&o.default.createElement("meta",{key:"twitter:image",name:"twitter:image",content:s}),l&&o.default.createElement("meta",{key:"twitter:alt",name:"twitter:image:alt",content:l})]}(n({},_))])}},2537:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.SocialPlatforms=t.getCurrentUrlAndCopyToClipboard=t.getShareUrl=t.getWhatsAppUrl=t.getFacebookUrl=t.getTwitterUrl=t.getLinkedinUrl=t.MetaHeadEmbed=void 0;var a=r(9062);Object.defineProperty(t,"MetaHeadEmbed",{enumerable:!0,get:function(){return n(a).default}});var o=r(9584);Object.defineProperty(t,"getLinkedinUrl",{enumerable:!0,get:function(){return n(o).default}});var i=r(6067);Object.defineProperty(t,"getTwitterUrl",{enumerable:!0,get:function(){return n(i).default}});var s=r(4887);Object.defineProperty(t,"getFacebookUrl",{enumerable:!0,get:function(){return n(s).default}});var l=r(1593);Object.defineProperty(t,"getWhatsAppUrl",{enumerable:!0,get:function(){return n(l).default}});var u=r(5198);Object.defineProperty(t,"getShareUrl",{enumerable:!0,get:function(){return n(u).default}});var c=r(9035);Object.defineProperty(t,"getCurrentUrlAndCopyToClipboard",{enumerable:!0,get:function(){return n(c).default}});var d=r(2716);Object.defineProperty(t,"SocialPlatforms",{enumerable:!0,get:function(){return d.SocialPlatforms}})},2716:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SocialPlatforms=void 0,function(e){e[e.Facebook=0]="Facebook",e[e.Linkedin=1]="Linkedin",e[e.Twitter=2]="Twitter",e[e.WhatsApp=3]="WhatsApp"}(t.SocialPlatforms||(t.SocialPlatforms={}))},6619:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.commaSeparate=void 0;t.commaSeparate=function(e){return"string"===typeof e?e:null===e||void 0===e?void 0:e.join(",")}},9035:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCurrentUrlAndCopyToClipboard=void 0;t.getCurrentUrlAndCopyToClipboard=function(){var e=window.location.href;return navigator.clipboard?navigator.clipboard.writeText(e):function(e){var t=document.createElement("textarea");t.value=e,t.style.top="0",t.style.left="0",t.style.position="fixed",document.body.appendChild(t),t.focus(),t.select(),document.body.removeChild(t)}(e),e},t.default=t.getCurrentUrlAndCopyToClipboard},4887:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getFacebookUrl=void 0;var a=n(r(5056));t.getFacebookUrl=function(e){var t=e.url,r=e.quote,n=e.hashtag;return n&&"#"!==n.charAt(0)&&(n="#"+n),"https://www.facebook.com/sharer/sharer.php"+a.default({u:t,quote:r,hashtag:n})},t.default=t.getFacebookUrl},9584:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var a=n(r(5056));t.default=function(e){var t=e.url,r=e.title,n=e.summary,o=e.source;return"https://linkedin.com/shareArticle"+a.default({url:t,mini:"true",title:r,summary:n,source:o})}},5198:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getShareUrl=void 0;var a=r(2716),o=n(r(4887)),i=n(r(9584)),s=n(r(6067)),l=n(r(1593));t.getShareUrl=function(e,t){var r=t.url,n=t.quote,u=t.hashtag,c=t.title,d=t.summary,f=t.source,p=t.text,m=t.hashtags,g=t.related;switch(e){case a.SocialPlatforms.Facebook:return o.default({url:r,quote:n,hashtag:u});case a.SocialPlatforms.Linkedin:return i.default({url:r,title:c,summary:d,source:f});case a.SocialPlatforms.Twitter:return s.default({url:r,text:p,hashtags:m,related:g});case a.SocialPlatforms.WhatsApp:return l.default({url:r,text:p})}},t.default=t.getShareUrl},6067:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getTwitterUrl=void 0;var a=r(6619),o=n(r(5056));t.getTwitterUrl=function(e){var t=e.url,r=e.text,n=e.hashtags,i=e.related;return"https://twitter.com/share"+o.default({url:t,text:r,hashtags:a.commaSeparate(n),related:a.commaSeparate(i)})},t.default=t.getTwitterUrl},1593:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getWhatsAppUrl=void 0;var a=n(r(5056));t.getWhatsAppUrl=function(e){var t=e.url,r=e.text;return"whatsapp://send?text="+a.default({text:r?r+" "+t:t})},t.default=t.getWhatsAppUrl},5056:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=Object.entries(e).filter((function(e){return e[1]})).map((function(e){var t=e[0],r=e[1];return encodeURIComponent(t)+"="+encodeURIComponent(String(r))}));return t.length?"?"+t.join("&"):""}},2725:function(e){"use strict";e.exports=e=>{if("string"!==typeof e)throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);return!/^[a-zA-Z]:\\/.test(e)&&/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(e)}},6876:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(469)}])},3685:function(e,t,r){"use strict";var n=r(3010),a=r(2537),o=(r(5170),r(81));t.Z=function(e){var t=e.overrideTitle,r=void 0===t?void 0:t,i=e.pageTitle,s=void 0===i?"Home":i,l=e.siteTitle,u=void 0===l?"Scoliotect":l,c=e.pagePath,d=void 0===c?"":c,f=e.description,p=void 0===f?"Scoliotect is a tool for automatically measuring the Cobb Angle\u2014the standard measurement to assess Scoliosis.":f,m=e.imageUrl,g=void 0===m?"assets/image-meta.png":m,y=e.imageAlt,h=void 0===y?"image meta":y,v=e.keywords,b=void 0===v?["scoliosis","cobb angle","computer vision","segmentation"]:v;return(0,n.jsx)(a.MetaHeadEmbed,{render:function(e){return(0,n.jsx)(o.default,{children:e})},siteTitle:u,pageTitle:s,titleTemplate:r||"[pageTitle] | [siteTitle]",description:p,baseSiteUrl:"",pagePath:d,keywords:b,imageUrl:g,imageAlt:h,twitter:{cardSize:"large",siteUsername:"@carlo_taleon",creatorUsername:"@carlo_taleon"}})}},469:function(e,t,r){"use strict";r.r(t);var n=r(3010),a=r(81),o=r(3685),i=r(4097),s=r(5170),l=r(9981),u=r.n(l),c=(r(8329),r(1519),r(2092),r(3723),r(550),r(8378),r(1632),r(7171),r(3954));function d(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function f(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){d(e,t,r[t])}))}return e}t.default=function(e){var t=e.Component,r=e.pageProps,l=(0,c.useRouter)();return(0,s.useEffect)((function(){var e=function(){return u().start()},t=function(){return u().done()};return l.events.on("routeChangeStart",e),l.events.on("routeChangeComplete",t),l.events.on("routeChangeError",t),function(){l.events.off("routeChangeStart",e),l.events.off("routeChangeComplete",t),l.events.off("routeChangeError",t)}}),[l.events]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(a.default,{children:[(0,n.jsx)("link",{rel:"icon",href:"data:,"}),(0,n.jsx)("link",{rel:"shortcut icon",href:"data:,"}),(0,n.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,n.jsx)("meta",{name:"theme-color",content:"#0073f5"})]}),(0,n.jsx)(o.Z,{}),(0,n.jsx)(t,f({},r)),(0,n.jsx)(i.x7,{containerClassName:"text-sm"})]})}},8329:function(){},7171:function(){},1632:function(){},8378:function(){},550:function(){},2092:function(){},3723:function(){},1519:function(){},81:function(e,t,r){e.exports=r(5212)},3954:function(e,t,r){e.exports=r(4255)},9981:function(e,t,r){var n,a;n=function(){var e={version:"0.2.0"},t=e.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};function r(e,t,r){return e<t?t:e>r?r:e}function n(e){return 100*(-1+e)}function a(e,r,a){var o;return(o="translate3d"===t.positionUsing?{transform:"translate3d("+n(e)+"%,0,0)"}:"translate"===t.positionUsing?{transform:"translate("+n(e)+"%,0)"}:{"margin-left":n(e)+"%"}).transition="all "+r+"ms "+a,o}e.configure=function(e){var r,n;for(r in e)void 0!==(n=e[r])&&e.hasOwnProperty(r)&&(t[r]=n);return this},e.status=null,e.set=function(n){var s=e.isStarted();n=r(n,t.minimum,1),e.status=1===n?null:n;var l=e.render(!s),u=l.querySelector(t.barSelector),c=t.speed,d=t.easing;return l.offsetWidth,o((function(r){""===t.positionUsing&&(t.positionUsing=e.getPositioningCSS()),i(u,a(n,c,d)),1===n?(i(l,{transition:"none",opacity:1}),l.offsetWidth,setTimeout((function(){i(l,{transition:"all "+c+"ms linear",opacity:0}),setTimeout((function(){e.remove(),r()}),c)}),c)):setTimeout(r,c)})),this},e.isStarted=function(){return"number"===typeof e.status},e.start=function(){e.status||e.set(0);var r=function(){setTimeout((function(){e.status&&(e.trickle(),r())}),t.trickleSpeed)};return t.trickle&&r(),this},e.done=function(t){return t||e.status?e.inc(.3+.5*Math.random()).set(1):this},e.inc=function(t){var n=e.status;return n?("number"!==typeof t&&(t=(1-n)*r(Math.random()*n,.1,.95)),n=r(n+t,0,.994),e.set(n)):e.start()},e.trickle=function(){return e.inc(Math.random()*t.trickleRate)},function(){var t=0,r=0;e.promise=function(n){return n&&"resolved"!==n.state()?(0===r&&e.start(),t++,r++,n.always((function(){0===--r?(t=0,e.done()):e.set((t-r)/t)})),this):this}}(),e.render=function(r){if(e.isRendered())return document.getElementById("nprogress");l(document.documentElement,"nprogress-busy");var a=document.createElement("div");a.id="nprogress",a.innerHTML=t.template;var o,s=a.querySelector(t.barSelector),u=r?"-100":n(e.status||0),c=document.querySelector(t.parent);return i(s,{transition:"all 0 linear",transform:"translate3d("+u+"%,0,0)"}),t.showSpinner||(o=a.querySelector(t.spinnerSelector))&&d(o),c!=document.body&&l(c,"nprogress-custom-parent"),c.appendChild(a),a},e.remove=function(){u(document.documentElement,"nprogress-busy"),u(document.querySelector(t.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&d(e)},e.isRendered=function(){return!!document.getElementById("nprogress")},e.getPositioningCSS=function(){var e=document.body.style,t="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return t+"Perspective"in e?"translate3d":t+"Transform"in e?"translate":"margin"};var o=function(){var e=[];function t(){var r=e.shift();r&&r(t)}return function(r){e.push(r),1==e.length&&t()}}(),i=function(){var e=["Webkit","O","Moz","ms"],t={};function r(e){return e.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,(function(e,t){return t.toUpperCase()}))}function n(t){var r=document.body.style;if(t in r)return t;for(var n,a=e.length,o=t.charAt(0).toUpperCase()+t.slice(1);a--;)if((n=e[a]+o)in r)return n;return t}function a(e){return e=r(e),t[e]||(t[e]=n(e))}function o(e,t,r){t=a(t),e.style[t]=r}return function(e,t){var r,n,a=arguments;if(2==a.length)for(r in t)void 0!==(n=t[r])&&t.hasOwnProperty(r)&&o(e,r,n);else o(e,a[1],a[2])}}();function s(e,t){return("string"==typeof e?e:c(e)).indexOf(" "+t+" ")>=0}function l(e,t){var r=c(e),n=r+t;s(r,t)||(e.className=n.substring(1))}function u(e,t){var r,n=c(e);s(e,t)&&(r=n.replace(" "+t+" "," "),e.className=r.substring(1,r.length-1))}function c(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function d(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return e},void 0===(a="function"===typeof n?n.call(t,r,t,e):n)||(e.exports=a)},4097:function(e,t,r){"use strict";r.d(t,{x7:function(){return re},ZP:function(){return ne}});var n=r(5170);let a={data:""},o=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||a},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,u=(e,t)=>{let r="",n="",a="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":n+="f"==o[1]?u(i,o):o+"{"+u(i,"k"==o[1]?"":t)+"}":"object"==typeof i?n+=u(i,t?t.replace(/([^,])+/g,(e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=u.p?u.p(o,i):o+":"+i+";")}return r+(t&&a?t+"{"+a+"}":a)+n},c={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e},f=(e,t,r,n,a)=>{let o=d(e),f=c[o]||(c[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!c[f]){let t=o!==e?e:(e=>{let t,r,n=[{}];for(;t=i.exec(e.replace(s,""));)t[4]?n.shift():t[3]?(r=t[3].replace(l," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(l," ").trim();return n[0]})(e);c[f]=u(a?{["@keyframes "+f]:t}:t,r?"":"."+f)}let p=r&&c.g?c.g:null;return r&&(c.g=c[f]),((e,t,r,n)=>{n?t.data=t.data.replace(n,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[f],t,n,p),f},p=(e,t,r)=>e.reduce(((e,n,a)=>{let o=t[a];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+n+(null==o?"":o)}),"");function m(e){let t=this||{},r=e.call?e(t.p):e;return f(r.unshift?r.raw?p(r,[].slice.call(arguments,1),t.p):r.reduce(((e,r)=>Object.assign(e,r&&r.call?r(t.p):r)),{}):r,o(t.target),t.g,t.o,t.k)}m.bind({g:1});let g,y,h,v=m.bind({k:1});function b(e,t){let r=this||{};return function(){let n=arguments;function a(o,i){let s=Object.assign({},o),l=s.className||a.className;r.p=Object.assign({theme:y&&y()},s),r.o=/ *go\d+/.test(l),s.className=m.apply(r,n)+(l?" "+l:""),t&&(s.ref=i);let u=e;return e[0]&&(u=s.as||e,delete s.as),h&&u[0]&&h(s),g(u,s)}return t?t(a):a}}var w=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,x=(()=>{let e=0;return()=>(++e).toString()})(),k=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),_="default",E=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map((e=>e.id===t.toast.id?{...e,...t.toast}:e))};case 2:let{toast:n}=t;return E(e,{type:e.toasts.find((e=>e.id===n.id))?1:0,toast:n});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map((e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e))};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter((e=>e.id!==t.toastId))};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map((e=>({...e,pauseDuration:e.pauseDuration+o})))}}},S=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},P=(e,t=_)=>{C[t]=E(C[t]||j,e),S.forEach((([e,r])=>{e===t&&r(C[t])}))},O=e=>Object.keys(C).forEach((t=>P(e,t))),U=(e=_)=>t=>{P(t,e)},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,r)=>{let n=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||x()}))(t,e,r);return U(n.toasterId||(e=>Object.keys(C).find((t=>C[t].toasts.some((t=>t.id===e)))))(n.id))({type:2,toast:n}),n.id},M=(e,t)=>A("blank")(e,t);M.error=A("error"),M.success=A("success"),M.loading=A("loading"),M.custom=A("custom"),M.dismiss=(e,t)=>{let r={type:3,toastId:e};t?U(t)(r):O(r)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let r={type:4,toastId:e};t?U(t)(r):O(r)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,r)=>{let n=M.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then((e=>{let a=t.success?w(t.success,e):void 0;return a?M.success(a,{id:n,...r,...null==r?void 0:r.success}):M.dismiss(n),e})).catch((e=>{let a=t.error?w(t.error,e):void 0;a?M.error(a,{id:n,...r,...null==r?void 0:r.error}):M.dismiss(n)})),e};var N=(e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=_)=>{let[r,a]=(0,n.useState)(C[t]||j),o=(0,n.useRef)(C[t]);(0,n.useEffect)((()=>(o.current!==C[t]&&a(C[t]),S.push([t,a]),()=>{let e=S.findIndex((([e])=>e===t));e>-1&&S.splice(e,1)})),[t]);let i=r.toasts.map((t=>{var r,n,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}}));return{...r,toasts:i}})(e,t),o=(0,n.useRef)(new Map).current,i=(0,n.useCallback)(((e,t=1e3)=>{if(o.has(e))return;let r=setTimeout((()=>{o.delete(e),s({type:4,toastId:e})}),t);o.set(e,r)}),[]);(0,n.useEffect)((()=>{if(a)return;let e=Date.now(),n=r.map((r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(!(n<0))return setTimeout((()=>M.dismiss(r.id,t)),n);r.visible&&M.dismiss(r.id)}));return()=>{n.forEach((e=>e&&clearTimeout(e)))}}),[r,a,t]);let s=(0,n.useCallback)(U(t),[t]),l=(0,n.useCallback)((()=>{s({type:5,time:Date.now()})}),[s]),u=(0,n.useCallback)(((e,t)=>{s({type:1,toast:{id:e,height:t}})}),[s]),c=(0,n.useCallback)((()=>{a&&s({type:6,time:Date.now()})}),[a,s]),d=(0,n.useCallback)(((e,t)=>{let{reverseOrder:n=!1,gutter:a=8,defaultPosition:o}=t||{},i=r.filter((t=>(t.position||o)===(e.position||o)&&t.height)),s=i.findIndex((t=>t.id===e.id)),l=i.filter(((e,t)=>t<s&&e.visible)).length;return i.filter((e=>e.visible)).slice(...n?[l+1]:[0,l]).reduce(((e,t)=>e+(t.height||0)+a),0)}),[r]);return(0,n.useEffect)((()=>{r.forEach((e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}}))}),[r,i]),{toasts:r,handlers:{updateHeight:u,startPause:l,endPause:c,calculateOffset:d}}},D=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,L=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,H=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,q=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${H} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,R=b("div")`
  position: absolute;
`,Z=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,X=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?n.createElement(X,null,t):t:"blank"===r?null:n.createElement(Z,null,n.createElement(W,{...a}),"loading"!==r&&n.createElement(R,null,"error"===r?n.createElement(I,{...a}):n.createElement(q,{...a})))},G=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,J=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,K=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Q=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,V=n.memo((({toast:e,position:t,style:r,children:a})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[n,a]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[G(r),J(r)];return{animation:t?`${v(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=n.createElement(Y,{toast:e}),s=n.createElement(Q,{...e.ariaProps},w(e.message,e));return n.createElement(K,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof a?a({icon:i,message:s}):n.createElement(n.Fragment,null,i,s))}));!function(e,t,r,n){u.p=t,g=e,y=r,h=n}(n.createElement);var ee=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let i=n.useCallback((t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;a(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}}),[e,a]);return n.createElement("div",{ref:i,className:t,style:r},o)},te=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,re=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,toasterId:i,containerStyle:s,containerClassName:l})=>{let{toasts:u,handlers:c}=N(r,i);return n.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},u.map((r=>{let i=r.position||t,s=((e,t)=>{let r=e.includes("top"),n=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...n,...a}})(i,c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}));return n.createElement(ee,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?te:"",style:s},"custom"===r.type?w(r.message,r):o?o(r):n.createElement(V,{toast:r,position:i}))})))},ne=M}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],(function(){return t(6876),t(4255)}));var r=e.O();_N_E=r}]);