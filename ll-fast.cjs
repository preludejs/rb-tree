function g(b,a){for(var d=0,e=b.length-1;d<=e;){var c=d+e>>>1,f=a(b[c]);if(0<f)d=c+1;else if(0>f)e=c-1;else return c}return-(d+1)}function q(b){if(null===b||!b.left||!b.left.red)throw Error("Fail.");var a=b.left;b.left=a.right;a.right=b;a.red=b.red;b.red=!0;return a}function r(b){if(null===b||!b.right||!b.right.red)throw Error("Fail.");var a=b.right;b.right=a.left;a.left=b;a.red=b.red;b.red=!0;return a}
function t(b){if(!b.left||!b.right)throw Error("Fail.");b.red=!b.red;b.left.red=!b.left.red;b.right.red=!b.right.red}
function u(b,a,d,e){if(null===a)return{keys:[d],values:[e],red:!0,left:null,right:null};var c=b(d,a.keys[0]);if(0>c)a.left=u(b,a.left,d,e);else if(0<c)a.right?a.right=u(b,a.right,d,e):(c=g(a.keys,function(v){return b(d,v)}),0<=c?a.values[c]=e:(a.keys.splice(-c-1,0,d),a.values.splice(-c-1,0,e),1024===a.keys.length&&(e=a.keys.splice(512,512),c=a.values.splice(512,512),a.right={keys:e,values:c,red:!0,left:null,right:null})));else return a.values[0]=e,a;var f,h;(null==(f=a.right)?0:f.red)&&(null==(h=
a.left)||!h.red)&&(a=r(a));var k,l,m;(null==(k=a.left)?0:k.red)&&(null==(l=a.left)?0:null==(m=l.left)?0:m.red)&&(a=q(a));var n,p;(null==(n=a.left)?0:n.red)&&(null==(p=a.right)?0:p.red)&&t(a);return a}module.exports=function(b,a,d){b.root=u(b.cmp,b.root,a,d);if(!b.root)throw Error("Fail.");b.root.red=!1};
