/*!
 * @pixi-essentials/object-pool - v0.0.3
 * Compiled Sun, 09 Aug 2020 15:59:00 UTC
 *
 * @pixi-essentials/object-pool is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Shukant K. Pal, All Rights Reserved
 * 
 */
this.PIXI=this.PIXI||{};var _pixi_essentials_object_pool=function(t,e){"use strict";class i{constructor(t,e){this._history=new Array(t),this._decayRatio=e,this._currentIndex=0;for(let e=0;e<t;e++)this._history[e]=0}next(t){const{_history:e,_decayRatio:i}=this,r=e.length;this._currentIndex=this._currentIndex<r-1?this._currentIndex+1:0,e[this._currentIndex]=t;let s=0,a=0;for(let t=this._currentIndex+1;t<r;t++)s=(s+e[t])*i,a=(a+1)*i;for(let t=0;t<=this._currentIndex;t++)s=(s+e[t])*i,a=(a+1)*i;return this._average=s/a,this._average}absDev(){let t=0;for(let e=0,i=this._history.length;e<i;e++)t+=Math.abs(this._history[e]-this._average);return t/this._history.length}}class r{constructor(t={}){this._gcTick=()=>{this._borrowRateAverage=this._borrowRateAverageProvider.next(this._borrowRate),this._marginAverage=this._marginAverageProvider.next(this._freeCount-this._borrowRate);const t=this._borrowRateAverageProvider.absDev();this._flowRate=0,this._borrowRate=0,this._returnRate=0;const e=this._freeCount,i=this._freeList.length;if(e<128&&this._borrowRateAverage<128&&i<128)return;const r=Math.max(this._borrowRateAverage*(this._capacityRatio-1),this._reserveCount);if(this._freeCount>r+t){const e=r+t;this.capacity=Math.min(this._freeList.length,Math.ceil(e)),this._freeCount=this._freeList.length}},this._freeList=[],this._freeCount=0,this._borrowRate=0,this._returnRate=0,this._flowRate=0,this._borrowRateAverage=0,this._reserveCount=t.reserve||0,this._capacityRatio=t.capacityRatio||1.2,this._decayRatio=t.decayRatio||.67,this._marginAverage=0,this._borrowRateAverageProvider=new i(128,this._decayRatio),this._marginAverageProvider=new i(128,this._decayRatio)}get capacity(){return this._freeList.length}set capacity(t){this._freeList.length=Math.ceil(t)}allocate(){return++this._borrowRate,++this._flowRate,this._freeCount>0?this._freeList[--this._freeCount]:this.create()}allocateArray(t){let e,i;Array.isArray(t)?(e=t,i=t.length):(i=t,e=new Array(i)),this._borrowRate+=i,this._flowRate+=i;let r=0;if(this._freeCount>0){const t=this._freeList,s=Math.min(this._freeCount,i);let a=this._freeCount;for(let i=0;i<s;i++)e[r]=t[a-1],++r,--a;this._freeCount=a}for(;r<i;)e[r]=this.create(),++r;return e}release(t){++this._returnRate,--this._flowRate,this._freeCount===this.capacity&&(this.capacity*=this._capacityRatio),this._freeList[this._freeCount]=t,++this._freeCount}releaseArray(t){this._returnRate+=t.length,this._flowRate-=t.length,this._freeCount+t.length>this.capacity&&(this.capacity=Math.max(this.capacity*this._capacityRatio,this._freeCount+t.length));for(let e=0,i=t.length;e<i;e++)this._freeList[this._freeCount]=t[e],++this._freeCount}reserve(t){if(this._reserveCount=t,this._freeCount<t){const e=this._freeCount-t;for(let t=0;t<e;t++)this._freeList[this._freeCount]=this.create(),++this._freeCount}}limit(t){if(this._freeCount>t){this.capacity>t*this._capacityRatio&&(this.capacity=t*this._capacityRatio);const e=Math.min(this._freeCount,this.capacity);for(let i=t;i<e;i++)this._freeList[i]=null}}startGC(t=e.Ticker.shared){t.add(this._gcTick,null,e.UPDATE_PRIORITY.UTILITY)}stopGC(t=e.Ticker.shared){t.remove(this._gcTick)}}const s=new Map;return t.ObjectPool=r,t.ObjectPoolFactory=class{static build(t){let e=s.get(t);return e||(e=new class extends r{create(){return new t}},s.set(t,e),e)}},t}({},PIXI);Object.assign(this.PIXI,_pixi_essentials_object_pool);
//# sourceMappingURL=pixi-object-pool.js.map
