/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const movehub_server_1 = __webpack_require__(/*! ./movehub-server */ "./src/movehub-server.ts");
const app = new movehub_server_1.MovehubServer().getApp();
exports.app = app;


/***/ }),

/***/ "./src/movehub-server.ts":
/*!*******************************!*\
  !*** ./src/movehub-server.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const http_1 = __webpack_require__(/*! http */ "http");
const socketIo = __webpack_require__(/*! socket.io */ "socket.io");
const movehub_service_1 = __webpack_require__(/*! ./movehub-service */ "./src/movehub-service.ts");
class MovehubServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || MovehubServer.PORT;
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
        this.listen();
    }
    getApp() {
        return this.app;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            this.movehubService = new movehub_service_1.MovehubService();
            this.movehubService.BleReady.subscribe(ready => {
                console.log('BLE Ready: ' + ready);
            });
            this.movehubService.getHub().subscribe(hub => {
                console.log('HubConnected');
                this.io.emit('message', 'hub connected');
            });
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}
MovehubServer.PORT = 8080;
exports.MovehubServer = MovehubServer;


/***/ }),

/***/ "./src/movehub-service.ts":
/*!********************************!*\
  !*** ./src/movehub-service.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const boost = __webpack_require__(/*! movehub-async */ "movehub-async");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
class MovehubService {
    constructor() {
        this.boost = boost;
        this.BleReady = rxjs_1.fromEvent(boost, 'ble-ready');
        this.HubFound = rxjs_1.fromEvent(this.boost, 'hub-found');
    }
    connect(details) {
        return rxjs_1.from(this.boost.connectAsync(details));
    }
    getHub() {
        return rxjs_1.from(this.boost.getHubAsync());
    }
}
exports.MovehubService = MovehubService;


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "movehub-async":
/*!********************************!*\
  !*** external "movehub-async" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("movehub-async");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tb3ZlaHViLXNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW92ZWh1Yi1zZXJ2aWNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW92ZWh1Yi1hc3luY1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJ4anNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb2NrZXQuaW9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsZ0dBQWlEO0FBRWpELE1BQU0sR0FBRyxHQUFHLElBQUksOEJBQWEsRUFBRSxDQUFD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QUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sTUFBTTtRQUNULE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0o7QUFsQkQsd0NBa0JDOzs7Ozs7Ozs7Ozs7QUNyQkQsb0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IE1vdmVodWJTZXJ2ZXIgfSBmcm9tICcuL21vdmVodWItc2VydmVyJztcblxuY29uc3QgYXBwID0gbmV3IE1vdmVodWJTZXJ2ZXIoKS5nZXRBcHAoKTtcbmV4cG9ydCB7IGFwcCB9O1xuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciwgU2VydmVyIH0gZnJvbSAnaHR0cCc7XG5pbXBvcnQgKiBhcyBzb2NrZXRJbyBmcm9tICdzb2NrZXQuaW8nO1xuXG5pbXBvcnQgeyBNb3ZlaHViU2VydmljZSB9IGZyb20gJy4vbW92ZWh1Yi1zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIE1vdmVodWJTZXJ2ZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUE9SVDogbnVtYmVyID0gODA4MDtcbiAgICBwcml2YXRlIGFwcDogZXhwcmVzcy5BcHBsaWNhdGlvbjtcbiAgICBwcml2YXRlIHNlcnZlcjogU2VydmVyO1xuICAgIHByaXZhdGUgaW86IFNvY2tldElPLlNlcnZlcjtcbiAgICBwcml2YXRlIHBvcnQ6IHN0cmluZyB8IG51bWJlcjtcblxuICAgIHByaXZhdGUgbW92ZWh1YlNlcnZpY2U6IE1vdmVodWJTZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xuICAgICAgICB0aGlzLnBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IE1vdmVodWJTZXJ2ZXIuUE9SVDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcy5hcHApO1xuICAgICAgICB0aGlzLmlvID0gc29ja2V0SW8odGhpcy5zZXJ2ZXIpO1xuICAgICAgICB0aGlzLmxpc3RlbigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBcHAoKTogZXhwcmVzcy5BcHBsaWNhdGlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxpc3RlbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1J1bm5pbmcgc2VydmVyIG9uIHBvcnQgJXMnLCB0aGlzLnBvcnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlvLm9uKCdjb25uZWN0JywgKHNvY2tldDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1vdmVodWJTZXJ2aWNlID0gbmV3IE1vdmVodWJTZXJ2aWNlKCk7XG4gICAgICAgICAgICB0aGlzLm1vdmVodWJTZXJ2aWNlLkJsZVJlYWR5LnN1YnNjcmliZShyZWFkeSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0JMRSBSZWFkeTogJyArIHJlYWR5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tb3ZlaHViU2VydmljZS5nZXRIdWIoKS5zdWJzY3JpYmUoaHViID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSHViQ29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pby5lbWl0KCdtZXNzYWdlJywgJ2h1YiBjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Nvbm5lY3RlZCBjbGllbnQgb24gcG9ydCAlcy4nLCB0aGlzLnBvcnQpO1xuICAgICAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKG06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbc2VydmVyXShtZXNzYWdlKTogJXMnLCBKU09OLnN0cmluZ2lmeShtKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pby5lbWl0KCdtZXNzYWdlJywgbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGllbnQgZGlzY29ubmVjdGVkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgYm9vc3QgZnJvbSAnbW92ZWh1Yi1hc3luYyc7XG5pbXBvcnQgeyBmcm9tLCBmcm9tRXZlbnQsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGNsYXNzIE1vdmVodWJTZXJ2aWNlIHtcbiAgICBwdWJsaWMgQmxlUmVhZHk6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcHVibGljIEh1YkZvdW5kOiBPYnNlcnZhYmxlPE1vdmVodWIuSUh1YkRldGFpbHM+O1xuXG4gICAgcHJpdmF0ZSBib29zdDogTW92ZWh1Yi5Cb29zdCA9IGJvb3N0O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQmxlUmVhZHkgPSBmcm9tRXZlbnQ8Ym9vbGVhbj4oYm9vc3QsICdibGUtcmVhZHknKTtcbiAgICAgICAgdGhpcy5IdWJGb3VuZCA9IGZyb21FdmVudDxNb3ZlaHViLklIdWJEZXRhaWxzPih0aGlzLmJvb3N0LCAnaHViLWZvdW5kJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbm5lY3QoZGV0YWlsczogTW92ZWh1Yi5JSHViRGV0YWlscyk6IE9ic2VydmFibGU8TW92ZWh1Yi5IdWI+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5ib29zdC5jb25uZWN0QXN5bmMoZGV0YWlscykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRIdWIoKTogT2JzZXJ2YWJsZTxNb3ZlaHViLkh1Yj4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmJvb3N0LmdldEh1YkFzeW5jKCkpO1xuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3ZlaHViLWFzeW5jXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJ4anNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=