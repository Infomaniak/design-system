import { existsSync, promises } from 'node:fs';
import { defaults } from '@istanbuljs/schema';
import { GenMapping, addMapping, toEncodedMap } from '@jridgewell/gen-mapping';
import * as traceMapping from '@jridgewell/trace-mapping';
import { eachMapping, TraceMap } from '@jridgewell/trace-mapping';
import require$$0$2 from 'istanbul-lib-coverage';
import { createInstrumenter } from 'istanbul-lib-instrument';
import libReport from 'istanbul-lib-report';
import require$$0$1 from 'path';
import require$$1$2 from 'fs';
import require$$1 from 'tty';
import require$$1$1 from 'util';
import require$$0 from 'os';
import reports from 'istanbul-reports';
import { parseModule } from 'magicast';
import { createDebug } from 'obug';
import c from 'tinyrainbow';
import { BaseCoverageProvider } from 'vitest/coverage';
import { isCSSRequest } from 'vitest/node';
import { C as COVERAGE_STORE_KEY } from './constants-BCJfMgEg.js';

function getDefaultExportFromCjs(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
	if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
	var f = n.default;
	if (typeof f == "function") {
		var a = function a() {
			var isInstance = false;
			try {
				isInstance = this instanceof a;
			} catch {}
			if (isInstance) {
				return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
	} else a = {};
	Object.defineProperty(a, "__esModule", { value: true });
	Object.keys(n).forEach(function(k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function() {
				return n[k];
			}
		});
	});
	return a;
}

var src = {exports: {}};

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function (val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}

					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;

			createDebug.names = [];
			createDebug.skips = [];

			const split = (typeof namespaces === 'string' ? namespaces : '')
				.trim()
				.replace(/\s+/g, ',')
				.split(',')
				.filter(Boolean);

			for (const ns of split) {
				if (ns[0] === '-') {
					createDebug.skips.push(ns.slice(1));
				} else {
					createDebug.names.push(ns);
				}
			}
		}

		/**
		 * Checks if the given string matches a namespace template, honoring
		 * asterisks as wildcards.
		 *
		 * @param {String} search
		 * @param {String} template
		 * @return {Boolean}
		 */
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;

			while (searchIndex < search.length) {
				if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
					// Match character or proceed with wildcard
					if (template[templateIndex] === '*') {
						starIndex = templateIndex;
						matchIndex = searchIndex;
						templateIndex++; // Skip the '*'
					} else {
						searchIndex++;
						templateIndex++;
					}
				} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
					// Backtrack to the last '*' and try to match more characters
					templateIndex = starIndex + 1;
					matchIndex++;
					searchIndex = matchIndex;
				} else {
					return false; // No match
				}
			}

			// Handle trailing '*' in template
			while (templateIndex < template.length && template[templateIndex] === '*') {
				templateIndex++;
			}

			return templateIndex === template.length;
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names,
				...createDebug.skips.map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) {
				if (matchesTemplate(name, skip)) {
					return false;
				}
			}

			for (const ns of createDebug.names) {
				if (matchesTemplate(name, ns)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	common = setup;
	return common;
}

/* eslint-env browser */

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser.exports;
	hasRequiredBrowser = 1;
	(function (module, exports$1) {
		/**
		 * This is the web browser implementation of `debug()`.
		 */

		exports$1.formatArgs = formatArgs;
		exports$1.save = save;
		exports$1.load = load;
		exports$1.useColors = useColors;
		exports$1.storage = localstorage();
		exports$1.destroy = (() => {
			let warned = false;

			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();

		/**
		 * Colors.
		 */

		exports$1.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		// eslint-disable-next-line complexity
		function useColors() {
			// NB: In an Electron preload script, document will be defined but not fully
			// initialized. Since we know we're in Chrome, we'll just detect this case
			// explicitly
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}

			// Internet Explorer and Edge do not support colors.
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}

			let m;

			// Is webkit? http://stackoverflow.com/a/16459606/376773
			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
			// eslint-disable-next-line no-return-assign
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				// Is firebug? http://stackoverflow.com/a/398120/376773
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				// Is firefox >= v31?
				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
				(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
				// Double check webkit in userAgent just in case we are in a worker
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);

			if (!this.useColors) {
				return;
			}

			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');

			// The final "%c" is somewhat tricky, because there could be other
			// arguments passed either before or after the %c, so we need to
			// figure out the correct index to insert the CSS into
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					// We only are interested in the *last* %c
					// (the user may have provided their own)
					lastC = index;
				}
			});

			args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.debug()` when available.
		 * No-op when `console.debug` is not a "function".
		 * If `console.debug` is not available, falls back
		 * to `console.log`.
		 *
		 * @api public
		 */
		exports$1.log = console.debug || console.log || (() => {});

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			try {
				if (namespaces) {
					exports$1.storage.setItem('debug', namespaces);
				} else {
					exports$1.storage.removeItem('debug');
				}
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */
		function load() {
			let r;
			try {
				r = exports$1.storage.getItem('debug') || exports$1.storage.getItem('DEBUG') ;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}

			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
			if (!r && typeof process !== 'undefined' && 'env' in process) {
				r = process.env.DEBUG;
			}

			return r;
		}

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
			try {
				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
				// The Browser also has localStorage in the global context.
				return localStorage;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		module.exports = requireCommon()(exports$1);

		const {formatters} = module.exports;

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		}; 
	} (browser, browser.exports));
	return browser.exports;
}

var node = {exports: {}};

var hasFlag;
var hasRequiredHasFlag;

function requireHasFlag () {
	if (hasRequiredHasFlag) return hasFlag;
	hasRequiredHasFlag = 1;

	hasFlag = (flag, argv = process.argv) => {
		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf('--');
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
	return hasFlag;
}

var supportsColor_1;
var hasRequiredSupportsColor;

function requireSupportsColor () {
	if (hasRequiredSupportsColor) return supportsColor_1;
	hasRequiredSupportsColor = 1;
	const os = require$$0;
	const tty = require$$1;
	const hasFlag = requireHasFlag();

	const {env} = process;

	let forceColor;
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false') ||
		hasFlag('color=never')) {
		forceColor = 0;
	} else if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		forceColor = 1;
	}

	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			forceColor = 1;
		} else if (env.FORCE_COLOR === 'false') {
			forceColor = 0;
		} else {
			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
		}
	}

	function translateLevel(level) {
		if (level === 0) {
			return false;
		}

		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}

	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) {
			return 0;
		}

		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}

		if (haveStream && !streamIsTTY && forceColor === undefined) {
			return 0;
		}

		const min = forceColor || 0;

		if (env.TERM === 'dumb') {
			return min;
		}

		if (process.platform === 'win32') {
			// Windows 10 build 10586 is the first Windows release that supports 256 colors.
			// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
			const osRelease = os.release().split('.');
			if (
				Number(osRelease[0]) >= 10 &&
				Number(osRelease[2]) >= 10586
			) {
				return Number(osRelease[2]) >= 14931 ? 3 : 2;
			}

			return 1;
		}

		if ('CI' in env) {
			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
				return 1;
			}

			return min;
		}

		if ('TEAMCITY_VERSION' in env) {
			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		}

		if (env.COLORTERM === 'truecolor') {
			return 3;
		}

		if ('TERM_PROGRAM' in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

			switch (env.TERM_PROGRAM) {
				case 'iTerm.app':
					return version >= 3 ? 3 : 2;
				case 'Apple_Terminal':
					return 2;
				// No default
			}
		}

		if (/-256(color)?$/i.test(env.TERM)) {
			return 2;
		}

		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
			return 1;
		}

		if ('COLORTERM' in env) {
			return 1;
		}

		return min;
	}

	function getSupportLevel(stream) {
		const level = supportsColor(stream, stream && stream.isTTY);
		return translateLevel(level);
	}

	supportsColor_1 = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
	};
	return supportsColor_1;
}

/**
 * Module dependencies.
 */

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node.exports;
	hasRequiredNode = 1;
	(function (module, exports$1) {
		const tty = require$$1;
		const util = require$$1$1;

		/**
		 * This is the Node.js implementation of `debug()`.
		 */

		exports$1.init = init;
		exports$1.log = log;
		exports$1.formatArgs = formatArgs;
		exports$1.save = save;
		exports$1.load = load;
		exports$1.useColors = useColors;
		exports$1.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);

		/**
		 * Colors.
		 */

		exports$1.colors = [6, 2, 3, 4, 5, 1];

		try {
			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
			// eslint-disable-next-line import/no-extraneous-dependencies
			const supportsColor = requireSupportsColor();

			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports$1.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
		}

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports$1.inspectOpts = Object.keys(process.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			// Camel-case
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});

			// Coerce string value into JS value
			let val = process.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}

			obj[prop] = val;
			return obj;
		}, {});

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
			return 'colors' in exports$1.inspectOpts ?
				Boolean(exports$1.inspectOpts.colors) :
				tty.isatty(process.stderr.fd);
		}

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			const {namespace: name, useColors} = this;

			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}

		function getDate() {
			if (exports$1.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}

		/**
		 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
		 */

		function log(...args) {
			return process.stderr.write(util.formatWithOptions(exports$1.inspectOpts, ...args) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			if (namespaces) {
				process.env.DEBUG = namespaces;
			} else {
				// If you set a process.env field to null or undefined, it gets cast to the
				// string 'null' or 'undefined'. Just delete instead.
				delete process.env.DEBUG;
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
			return process.env.DEBUG;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init(debug) {
			debug.inspectOpts = {};

			const keys = Object.keys(exports$1.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports$1.inspectOpts[keys[i]];
			}
		}

		module.exports = requireCommon()(exports$1);

		const {formatters} = module.exports;

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};

		/**
		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
		 */

		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		}; 
	} (node, node.exports));
	return node.exports;
}

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src.exports;
	hasRequiredSrc = 1;
	if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
		src.exports = requireBrowser();
	} else {
		src.exports = requireNode();
	}
	return src.exports;
}

var require$$3 = /*@__PURE__*/getAugmentedNamespace(traceMapping);

/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var pathutils;
var hasRequiredPathutils;

function requirePathutils () {
	if (hasRequiredPathutils) return pathutils;
	hasRequiredPathutils = 1;

	const path = require$$0$1;

	pathutils = {
	    isAbsolute: path.isAbsolute,
	    asAbsolute(file, baseDir) {
	        return path.isAbsolute(file)
	            ? file
	            : path.resolve(baseDir || process.cwd(), file);
	    },
	    relativeTo(file, origFile) {
	        return path.isAbsolute(file)
	            ? file
	            : path.resolve(path.dirname(origFile), file);
	    }
	};
	return pathutils;
}

/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var mapped;
var hasRequiredMapped;

function requireMapped () {
	if (hasRequiredMapped) return mapped;
	hasRequiredMapped = 1;

	const { FileCoverage } = require$$0$2.classes;

	function locString(loc) {
	    return [
	        loc.start.line,
	        loc.start.column,
	        loc.end.line,
	        loc.end.column
	    ].join(':');
	}

	class MappedCoverage extends FileCoverage {
	    constructor(pathOrObj) {
	        super(pathOrObj);

	        this.meta = {
	            last: {
	                s: 0,
	                f: 0,
	                b: 0
	            },
	            seen: {}
	        };
	    }

	    addStatement(loc, hits) {
	        const key = 's:' + locString(loc);
	        const { meta } = this;
	        let index = meta.seen[key];

	        if (index === undefined) {
	            index = meta.last.s;
	            meta.last.s += 1;
	            meta.seen[key] = index;
	            this.statementMap[index] = this.cloneLocation(loc);
	        }

	        this.s[index] = this.s[index] || 0;
	        this.s[index] += hits;
	        return index;
	    }

	    addFunction(name, decl, loc, hits) {
	        const key = 'f:' + locString(decl);
	        const { meta } = this;
	        let index = meta.seen[key];

	        if (index === undefined) {
	            index = meta.last.f;
	            meta.last.f += 1;
	            meta.seen[key] = index;
	            name = name || `(unknown_${index})`;
	            this.fnMap[index] = {
	                name,
	                decl: this.cloneLocation(decl),
	                loc: this.cloneLocation(loc)
	            };
	        }

	        this.f[index] = this.f[index] || 0;
	        this.f[index] += hits;
	        return index;
	    }

	    addBranch(type, loc, branchLocations, hits) {
	        const key = ['b', ...branchLocations.map(l => locString(l))].join(':');
	        const { meta } = this;
	        let index = meta.seen[key];
	        if (index === undefined) {
	            index = meta.last.b;
	            meta.last.b += 1;
	            meta.seen[key] = index;
	            this.branchMap[index] = {
	                loc,
	                type,
	                locations: branchLocations.map(l => this.cloneLocation(l))
	            };
	        }

	        if (!this.b[index]) {
	            this.b[index] = branchLocations.map(() => 0);
	        }

	        hits.forEach((hit, i) => {
	            this.b[index][i] += hit;
	        });
	        return index;
	    }

	    /* Returns a clone of the location object with only the attributes of interest */
	    cloneLocation(loc) {
	        return {
	            start: {
	                line: loc.start.line,
	                column: loc.start.column
	            },
	            end: {
	                line: loc.end.line,
	                column: loc.end.column
	            }
	        };
	    }
	}

	mapped = {
	    MappedCoverage
	};
	return mapped;
}

var getMapping_1;
var hasRequiredGetMapping;

function requireGetMapping () {
	if (hasRequiredGetMapping) return getMapping_1;
	hasRequiredGetMapping = 1;

	const pathutils = requirePathutils();
	const {
	    originalPositionFor,
	    allGeneratedPositionsFor,
	    GREATEST_LOWER_BOUND,
	    LEAST_UPPER_BOUND
	} = require$$3;

	/**
	 * AST ranges are inclusive for start positions and exclusive for end positions.
	 * Source maps are also logically ranges over text, though interacting with
	 * them is generally achieved by working with explicit positions.
	 *
	 * When finding the _end_ location of an AST item, the range behavior is
	 * important because what we're asking for is the _end_ of whatever range
	 * corresponds to the end location we seek.
	 *
	 * This boils down to the following steps, conceptually, though the source-map
	 * library doesn't expose primitives to do this nicely:
	 *
	 * 1. Find the range on the generated file that ends at, or exclusively
	 *    contains the end position of the AST node.
	 * 2. Find the range on the original file that corresponds to
	 *    that generated range.
	 * 3. Find the _end_ location of that original range.
	 */
	function originalEndPositionFor(sourceMap, generatedEnd) {
	    // Given the generated location, find the original location of the mapping
	    // that corresponds to a range on the generated file that overlaps the
	    // generated file end location. Note however that this position on its
	    // own is not useful because it is the position of the _start_ of the range
	    // on the original file, and we want the _end_ of the range.
	    let beforeEndMapping = originalPositionTryBoth(
	        sourceMap,
	        generatedEnd.line,
	        generatedEnd.column - 1
	    );
	    if (beforeEndMapping.source === null) {
	        // search the previous lines as the mapping was not found on the same line
	        for (
	            let line = generatedEnd.line;
	            line > 0 && beforeEndMapping.source === null;
	            line--
	        ) {
	            beforeEndMapping = originalPositionTryBoth(
	                sourceMap,
	                line,
	                Infinity
	            );
	        }
	        if (beforeEndMapping.source === null) {
	            return null;
	        }
	    }

	    // Convert that original position back to a generated one, with a bump
	    // to the right, and a rightward bias. Since 'generatedPositionFor' searches
	    // for mappings in the original-order sorted list, this will find the
	    // mapping that corresponds to the one immediately after the
	    // beforeEndMapping mapping.
	    const afterEndMappings = allGeneratedPositionsFor(sourceMap, {
	        source: beforeEndMapping.source,
	        line: beforeEndMapping.line,
	        column: beforeEndMapping.column + 1,
	        bias: LEAST_UPPER_BOUND
	    });

	    for (let i = 0; i < afterEndMappings.length; i++) {
	        const afterEndMapping = afterEndMappings[i];
	        if (afterEndMapping.line === null) continue;

	        const original = originalPositionFor(sourceMap, afterEndMapping);
	        // If the lines match, it means that something comes after our mapping,
	        // so it must end where this one begins.
	        if (original.line === beforeEndMapping.line) return original;
	    }

	    // If a generated mapping wasn't found (or all that were found were not on
	    // the same line), then there's nothing after this range and we can
	    // consider it to extend to infinity.
	    return {
	        source: beforeEndMapping.source,
	        line: beforeEndMapping.line,
	        column: Infinity
	    };
	}

	/**
	 * Attempts to determine the original source position, first
	 * returning the closest element to the left (GREATEST_LOWER_BOUND),
	 * and next returning the closest element to the right (LEAST_UPPER_BOUND).
	 */
	function originalPositionTryBoth(sourceMap, line, column) {
	    const mapping = originalPositionFor(sourceMap, {
	        line,
	        column,
	        bias: GREATEST_LOWER_BOUND
	    });
	    if (mapping.source === null) {
	        return originalPositionFor(sourceMap, {
	            line,
	            column,
	            bias: LEAST_UPPER_BOUND
	        });
	    } else {
	        return mapping;
	    }
	}

	function isInvalidPosition(pos) {
	    return (
	        !pos ||
	        typeof pos.line !== 'number' ||
	        typeof pos.column !== 'number' ||
	        pos.line < 0 ||
	        pos.column < 0
	    );
	}

	/**
	 * determines the original position for a given location
	 * @param  {SourceMapConsumer} sourceMap the source map
	 * @param  {Object} generatedLocation the original location Object
	 * @returns {Object} the remapped location Object
	 */
	function getMapping(sourceMap, generatedLocation, origFile) {
	    if (!generatedLocation) {
	        return null;
	    }

	    if (
	        isInvalidPosition(generatedLocation.start) ||
	        isInvalidPosition(generatedLocation.end)
	    ) {
	        return null;
	    }

	    const start = originalPositionTryBoth(
	        sourceMap,
	        generatedLocation.start.line,
	        generatedLocation.start.column
	    );
	    let end = originalEndPositionFor(sourceMap, generatedLocation.end);

	    /* istanbul ignore if: edge case too hard to test for */
	    if (!(start && end)) {
	        return null;
	    }

	    if (!(start.source && end.source)) {
	        return null;
	    }

	    if (start.source !== end.source) {
	        return null;
	    }

	    /* istanbul ignore if: edge case too hard to test for */
	    if (start.line === null || start.column === null) {
	        return null;
	    }

	    /* istanbul ignore if: edge case too hard to test for */
	    if (end.line === null || end.column === null) {
	        return null;
	    }

	    if (start.line === end.line && start.column === end.column) {
	        end = originalPositionFor(sourceMap, {
	            line: generatedLocation.end.line,
	            column: generatedLocation.end.column,
	            bias: LEAST_UPPER_BOUND
	        });
	        end.column -= 1;
	    }

	    return {
	        source: pathutils.relativeTo(start.source, origFile),
	        loc: {
	            start: {
	                line: start.line,
	                column: start.column
	            },
	            end: {
	                line: end.line,
	                column: end.column
	            }
	        }
	    };
	}

	getMapping_1 = getMapping;
	return getMapping_1;
}

/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var transformUtils;
var hasRequiredTransformUtils;

function requireTransformUtils () {
	if (hasRequiredTransformUtils) return transformUtils;
	hasRequiredTransformUtils = 1;

	function getUniqueKey(pathname) {
	    return pathname.replace(/[\\/]/g, '_');
	}

	function getOutput(cache) {
	    return Object.values(cache).reduce(
	        (output, { file, mappedCoverage }) => ({
	            ...output,
	            [file]: mappedCoverage
	        }),
	        {}
	    );
	}

	transformUtils = { getUniqueKey, getOutput };
	return transformUtils;
}

/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var transformer;
var hasRequiredTransformer;

function requireTransformer () {
	if (hasRequiredTransformer) return transformer;
	hasRequiredTransformer = 1;

	const debug = requireSrc()('istanbuljs');
	const libCoverage = require$$0$2;
	const { MappedCoverage } = requireMapped();
	const getMapping = requireGetMapping();
	const { getUniqueKey, getOutput } = requireTransformUtils();

	class SourceMapTransformer {
	    constructor(finder, opts = {}) {
	        this.finder = finder;
	        this.baseDir = opts.baseDir || process.cwd();
	        this.resolveMapping = opts.getMapping || getMapping;
	    }

	    processFile(fc, sourceMap, coverageMapper) {
	        let changes = 0;

	        Object.entries(fc.statementMap).forEach(([s, loc]) => {
	            const hits = fc.s[s];
	            const mapping = this.resolveMapping(sourceMap, loc, fc.path);

	            if (mapping) {
	                changes += 1;
	                const mappedCoverage = coverageMapper(mapping.source);
	                mappedCoverage.addStatement(mapping.loc, hits);
	            }
	        });

	        Object.entries(fc.fnMap).forEach(([f, fnMeta]) => {
	            const hits = fc.f[f];
	            const mapping = this.resolveMapping(
	                sourceMap,
	                fnMeta.decl,
	                fc.path
	            );

	            const spanMapping = this.resolveMapping(
	                sourceMap,
	                fnMeta.loc,
	                fc.path
	            );

	            if (
	                mapping &&
	                spanMapping &&
	                mapping.source === spanMapping.source
	            ) {
	                changes += 1;
	                const mappedCoverage = coverageMapper(mapping.source);
	                mappedCoverage.addFunction(
	                    fnMeta.name,
	                    mapping.loc,
	                    spanMapping.loc,
	                    hits
	                );
	            }
	        });

	        Object.entries(fc.branchMap).forEach(([b, branchMeta]) => {
	            const hits = fc.b[b];
	            const locs = [];
	            const mappedHits = [];
	            let source;
	            let skip;

	            branchMeta.locations.forEach((loc, i) => {
	                const mapping = this.resolveMapping(sourceMap, loc, fc.path);
	                if (mapping) {
	                    if (!source) {
	                        source = mapping.source;
	                    }

	                    if (mapping.source !== source) {
	                        skip = true;
	                    }

	                    locs.push(mapping.loc);
	                    mappedHits.push(hits[i]);
	                }
	                // Check if this is an implicit else
	                else if (
	                    source &&
	                    branchMeta.type === 'if' &&
	                    i > 0 &&
	                    loc.start.line === undefined &&
	                    loc.start.end === undefined &&
	                    loc.end.line === undefined &&
	                    loc.end.end === undefined
	                ) {
	                    locs.push(loc);
	                    mappedHits.push(hits[i]);
	                }
	            });

	            const locMapping = branchMeta.loc
	                ? this.resolveMapping(sourceMap, branchMeta.loc, fc.path)
	                : null;

	            if (!skip && locs.length > 0) {
	                changes += 1;
	                const mappedCoverage = coverageMapper(source);
	                mappedCoverage.addBranch(
	                    branchMeta.type,
	                    locMapping ? locMapping.loc : locs[0],
	                    locs,
	                    mappedHits
	                );
	            }
	        });

	        return changes > 0;
	    }

	    async transform(coverageMap) {
	        const uniqueFiles = {};
	        const getMappedCoverage = file => {
	            const key = getUniqueKey(file);
	            if (!uniqueFiles[key]) {
	                uniqueFiles[key] = {
	                    file,
	                    mappedCoverage: new MappedCoverage(file)
	                };
	            }

	            return uniqueFiles[key].mappedCoverage;
	        };

	        for (const file of coverageMap.files()) {
	            const fc = coverageMap.fileCoverageFor(file);
	            const sourceMap = await this.finder(file, fc);

	            if (sourceMap) {
	                const changed = this.processFile(
	                    fc,
	                    sourceMap,
	                    getMappedCoverage
	                );
	                if (!changed) {
	                    debug(`File [${file}] ignored, nothing could be mapped`);
	                }
	            } else {
	                uniqueFiles[getUniqueKey(file)] = {
	                    file,
	                    mappedCoverage: new MappedCoverage(fc)
	                };
	            }
	        }

	        return libCoverage.createCoverageMap(getOutput(uniqueFiles));
	    }
	}

	transformer = {
	    SourceMapTransformer
	};
	return transformer;
}

/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var mapStore;
var hasRequiredMapStore;

function requireMapStore () {
	if (hasRequiredMapStore) return mapStore;
	hasRequiredMapStore = 1;

	const path = require$$0$1;
	const fs = require$$1$2;
	const debug = requireSrc()('istanbuljs');
	const { TraceMap, sourceContentFor } = require$$3;
	const pathutils = requirePathutils();
	const { SourceMapTransformer } = requireTransformer();

	/**
	 * Tracks source maps for registered files
	 */
	class MapStore {
	    /**
	     * @param {Object} opts [opts=undefined] options.
	     * @param {Boolean} opts.verbose [opts.verbose=false] verbose mode
	     * @param {String} opts.baseDir [opts.baseDir=null] alternate base directory
	     *  to resolve sourcemap files
	     * @param {Class} opts.SourceStore [opts.SourceStore=Map] class to use for
	     * SourceStore.  Must support `get`, `set` and `clear` methods.
	     * @param {Array} opts.sourceStoreOpts [opts.sourceStoreOpts=[]] arguments
	     * to use in the SourceStore constructor.
	     * @constructor
	     */
	    constructor(opts) {
	        opts = {
	            baseDir: null,
	            verbose: false,
	            SourceStore: Map,
	            sourceStoreOpts: [],
	            ...opts
	        };
	        this.baseDir = opts.baseDir;
	        this.verbose = opts.verbose;
	        this.sourceStore = new opts.SourceStore(...opts.sourceStoreOpts);
	        this.data = Object.create(null);
	        this.sourceFinder = this.sourceFinder.bind(this);
	    }

	    /**
	     * Registers a source map URL with this store. It makes some input sanity checks
	     * and silently fails on malformed input.
	     * @param transformedFilePath - the file path for which the source map is valid.
	     *  This must *exactly* match the path stashed for the coverage object to be
	     *  useful.
	     * @param sourceMapUrl - the source map URL, **not** a comment
	     */
	    registerURL(transformedFilePath, sourceMapUrl) {
	        const d = 'data:';

	        if (
	            sourceMapUrl.length > d.length &&
	            sourceMapUrl.substring(0, d.length) === d
	        ) {
	            const b64 = 'base64,';
	            const pos = sourceMapUrl.indexOf(b64);
	            if (pos > 0) {
	                this.data[transformedFilePath] = {
	                    type: 'encoded',
	                    data: sourceMapUrl.substring(pos + b64.length)
	                };
	            } else {
	                debug(`Unable to interpret source map URL: ${sourceMapUrl}`);
	            }

	            return;
	        }

	        const dir = path.dirname(path.resolve(transformedFilePath));
	        const file = path.resolve(dir, sourceMapUrl);
	        this.data[transformedFilePath] = { type: 'file', data: file };
	    }

	    /**
	     * Registers a source map object with this store. Makes some basic sanity checks
	     * and silently fails on malformed input.
	     * @param transformedFilePath - the file path for which the source map is valid
	     * @param sourceMap - the source map object
	     */
	    registerMap(transformedFilePath, sourceMap) {
	        if (sourceMap && sourceMap.version) {
	            this.data[transformedFilePath] = {
	                type: 'object',
	                data: sourceMap
	            };
	        } else {
	            debug(
	                'Invalid source map object: ' +
	                    JSON.stringify(sourceMap, null, 2)
	            );
	        }
	    }

	    /**
	     * Retrieve a source map object from this store.
	     * @param filePath - the file path for which the source map is valid
	     * @returns {Object} a parsed source map object
	     */
	    getSourceMapSync(filePath) {
	        try {
	            if (!this.data[filePath]) {
	                return;
	            }

	            const d = this.data[filePath];
	            if (d.type === 'file') {
	                return JSON.parse(fs.readFileSync(d.data, 'utf8'));
	            }

	            if (d.type === 'encoded') {
	                return JSON.parse(Buffer.from(d.data, 'base64').toString());
	            }

	            /* The caller might delete properties */
	            return {
	                ...d.data
	            };
	        } catch (error) {
	            debug('Error returning source map for ' + filePath);
	            debug(error.stack);

	            return;
	        }
	    }

	    /**
	     * Add inputSourceMap property to coverage data
	     * @param coverageData - the __coverage__ object
	     * @returns {Object} a parsed source map object
	     */
	    addInputSourceMapsSync(coverageData) {
	        Object.entries(coverageData).forEach(([filePath, data]) => {
	            if (data.inputSourceMap) {
	                return;
	            }

	            const sourceMap = this.getSourceMapSync(filePath);
	            if (sourceMap) {
	                data.inputSourceMap = sourceMap;
	                /* This huge property is not needed. */
	                delete data.inputSourceMap.sourcesContent;
	            }
	        });
	    }

	    sourceFinder(filePath) {
	        const content = this.sourceStore.get(filePath);
	        if (content !== undefined) {
	            return content;
	        }

	        if (path.isAbsolute(filePath)) {
	            return fs.readFileSync(filePath, 'utf8');
	        }

	        return fs.readFileSync(
	            pathutils.asAbsolute(filePath, this.baseDir),
	            'utf8'
	        );
	    }

	    /**
	     * Transforms the coverage map provided into one that refers to original
	     * sources when valid mappings have been registered with this store.
	     * @param {CoverageMap} coverageMap - the coverage map to transform
	     * @returns {Promise<CoverageMap>} the transformed coverage map
	     */
	    async transformCoverage(coverageMap) {
	        const hasInputSourceMaps = coverageMap
	            .files()
	            .some(
	                file => coverageMap.fileCoverageFor(file).data.inputSourceMap
	            );

	        if (!hasInputSourceMaps && Object.keys(this.data).length === 0) {
	            return coverageMap;
	        }

	        const transformer = new SourceMapTransformer(
	            async (filePath, coverage) => {
	                try {
	                    const obj =
	                        coverage.data.inputSourceMap ||
	                        this.getSourceMapSync(filePath);
	                    if (!obj) {
	                        return null;
	                    }

	                    const smc = new TraceMap(obj);
	                    smc.sources.forEach(s => {
	                        if (s) {
	                            const content = sourceContentFor(smc, s);
	                            if (content) {
	                                const sourceFilePath = pathutils.relativeTo(
	                                    s,
	                                    filePath
	                                );
	                                this.sourceStore.set(sourceFilePath, content);
	                            }
	                        }
	                    });

	                    return smc;
	                } catch (error) {
	                    debug('Error returning source map for ' + filePath);
	                    debug(error.stack);

	                    return null;
	                }
	            }
	        );

	        return await transformer.transform(coverageMap);
	    }

	    /**
	     * Disposes temporary resources allocated by this map store
	     */
	    dispose() {
	        this.sourceStore.clear();
	    }
	}

	mapStore = { MapStore };
	return mapStore;
}

/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var istanbulLibSourceMaps;
var hasRequiredIstanbulLibSourceMaps;

function requireIstanbulLibSourceMaps () {
	if (hasRequiredIstanbulLibSourceMaps) return istanbulLibSourceMaps;
	hasRequiredIstanbulLibSourceMaps = 1;

	const { MapStore } = requireMapStore();
	/**
	 * @module Exports
	 */
	istanbulLibSourceMaps = {
	    createSourceMapStore(opts) {
	        return new MapStore(opts);
	    }
	};
	return istanbulLibSourceMaps;
}

var istanbulLibSourceMapsExports = requireIstanbulLibSourceMaps();
var libSourceMaps = /*@__PURE__*/getDefaultExportFromCjs(istanbulLibSourceMapsExports);

var version = "4.0.18";

const debug = createDebug("vitest:coverage");
class IstanbulCoverageProvider extends BaseCoverageProvider {
	name = "istanbul";
	version = version;
	instrumenter;
	transformedModuleIds = new Set();
	initialize(ctx) {
		this._initialize(ctx);
		this.instrumenter = createInstrumenter({
			produceSourceMap: true,
			autoWrap: false,
			esModules: true,
			compact: false,
			coverageVariable: COVERAGE_STORE_KEY,
			coverageGlobalScope: "globalThis",
			coverageGlobalScopeFunc: false,
			ignoreClassMethods: this.options.ignoreClassMethods,
			parserPlugins: [...defaults.instrumenter.parserPlugins, ["importAttributes", { deprecatedAssertSyntax: true }]],
			generatorOpts: { importAttributesKeyword: "with" }
		});
	}
	requiresTransform(id) {
		// Istanbul/babel cannot instrument CSS - e.g. Vue imports end up here.
		// File extension itself is .vue, but it contains CSS.
		// e.g. "Example.vue?vue&type=style&index=0&scoped=f7f04e08&lang.css"
		if (isCSSRequest(id)) {
			return false;
		}
		if (!this.isIncluded(removeQueryParameters(id))) {
			return false;
		}
		return true;
	}
	onFileTransform(sourceCode, id, pluginCtx) {
		if (!this.requiresTransform(id)) {
			return;
		}
		const sourceMap = pluginCtx.getCombinedSourcemap();
		sourceMap.sources = sourceMap.sources.map(removeQueryParameters);
		sourceCode = sourceCode.replaceAll("_ts_decorate", "/* istanbul ignore next */_ts_decorate").replaceAll(/(if +\(import\.meta\.vitest\))/g, "/* istanbul ignore next */ $1");
		const code = this.instrumenter.instrumentSync(sourceCode, id, sourceMap);
		if (!id.includes("vitest-uncovered-coverage=true")) {
			const transformMap = new GenMapping(sourceMap);
			eachMapping(new TraceMap(sourceMap), (mapping) => {
				addMapping(transformMap, {
					generated: {
						line: mapping.generatedLine,
						column: mapping.generatedColumn
					},
					original: {
						line: mapping.generatedLine,
						column: mapping.generatedColumn
					},
					content: sourceCode,
					name: mapping.name || "",
					source: mapping.source || ""
				});
			});
			const encodedMap = toEncodedMap(transformMap);
			delete encodedMap.file;
			delete encodedMap.ignoreList;
			delete encodedMap.sourceRoot;
			this.instrumenter.instrumentSync(sourceCode, id, encodedMap);
		}
		const map = this.instrumenter.lastSourceMap();
		this.transformedModuleIds.add(id);
		return {
			code,
			map
		};
	}
	createCoverageMap() {
		return require$$0$2.createCoverageMap({});
	}
	async generateCoverage({ allTestsRun }) {
		const start = debug.enabled ? performance.now() : 0;
		const coverageMap = this.createCoverageMap();
		let coverageMapByEnvironment = this.createCoverageMap();
		await this.readCoverageFiles({
			onFileRead(coverage) {
				coverageMapByEnvironment.merge(coverage);
			},
			onFinished: async () => {
				// Source maps can change based on projectName and transform mode.
				// Coverage transform re-uses source maps so we need to separate transforms from each other.
				const transformedCoverage = await transformCoverage(coverageMapByEnvironment);
				coverageMap.merge(transformedCoverage);
				coverageMapByEnvironment = this.createCoverageMap();
			},
			onDebug: debug
		});
		// Include untested files when all tests were run (not a single file re-run)
		// or if previous results are preserved by "cleanOnRerun: false"
		if (this.options.include != null && (allTestsRun || !this.options.cleanOnRerun)) {
			const coveredFiles = coverageMap.files();
			const uncoveredCoverage = await this.getCoverageMapForUncoveredFiles(coveredFiles);
			coverageMap.merge(await transformCoverage(uncoveredCoverage));
		}
		coverageMap.filter((filename) => {
			const exists = existsSync(filename);
			if (this.options.excludeAfterRemap) {
				return exists && this.isIncluded(filename);
			}
			return exists;
		});
		if (debug.enabled) {
			debug("Generate coverage total time %d ms", (performance.now() - start).toFixed());
		}
		return coverageMap;
	}
	async generateReports(coverageMap, allTestsRun) {
		const context = libReport.createContext({
			dir: this.options.reportsDirectory,
			coverageMap,
			watermarks: this.options.watermarks
		});
		if (this.hasTerminalReporter(this.options.reporter)) {
			this.ctx.logger.log(c.blue(" % ") + c.dim("Coverage report from ") + c.yellow(this.name));
		}
		for (const reporter of this.options.reporter) {
			// Type assertion required for custom reporters
			reports.create(reporter[0], {
				skipFull: this.options.skipFull,
				projectRoot: this.ctx.config.root,
				...reporter[1]
			}).execute(context);
		}
		if (this.options.thresholds) {
			await this.reportThresholds(coverageMap, allTestsRun);
		}
	}
	async parseConfigModule(configFilePath) {
		return parseModule(await promises.readFile(configFilePath, "utf8"));
	}
	async getCoverageMapForUncoveredFiles(coveredFiles) {
		const uncoveredFiles = await this.getUntestedFiles(coveredFiles);
		const cacheKey = new Date().getTime();
		const coverageMap = this.createCoverageMap();
		const transform = this.createUncoveredFileTransformer(this.ctx);
		// Note that these cannot be run parallel as synchronous instrumenter.lastFileCoverage
		// returns the coverage of the last transformed file
		for (const [index, filename] of uncoveredFiles.entries()) {
			let timeout;
			let start;
			if (debug.enabled) {
				start = performance.now();
				timeout = setTimeout(() => debug(c.bgRed(`File "${filename}" is taking longer than 3s`)), 3e3);
				debug("Uncovered file %d/%d", index, uncoveredFiles.length);
			}
			// Make sure file is not served from cache so that instrumenter loads up requested file coverage
			await transform(`${filename}?cache=${cacheKey}&vitest-uncovered-coverage=true`);
			const lastCoverage = this.instrumenter.lastFileCoverage();
			coverageMap.addFileCoverage(lastCoverage);
			if (debug.enabled) {
				clearTimeout(timeout);
				const diff = performance.now() - start;
				const color = diff > 500 ? c.bgRed : c.bgGreen;
				debug(`${color(` ${diff.toFixed()} ms `)} ${filename}`);
			}
		}
		return coverageMap;
	}
	// the coverage can be enabled after the tests are run
	// this means the coverage will not be injected because the modules are cached,
	// so we are invalidating all modules that don't have the istanbul coverage injected
	onEnabled() {
		const environments = this.ctx.projects.flatMap((project) => [...Object.values(project.vite.environments), ...Object.values(project.browser?.vite.environments || {})]);
		const seen = new Set();
		environments.forEach((environment) => {
			environment.moduleGraph.idToModuleMap.forEach((node) => {
				this.invalidateTree(node, environment.moduleGraph, seen);
			});
		});
	}
	invalidateTree(node, moduleGraph, seen) {
		if (seen.has(node)) {
			return;
		}
		if (node.id && !this.transformedModuleIds.has(node.id)) {
			moduleGraph.invalidateModule(node, seen);
		}
		seen.add(node);
		node.importedModules.forEach((mod) => {
			this.invalidateTree(mod, moduleGraph, seen);
		});
	}
}
async function transformCoverage(coverageMap) {
	const sourceMapStore = libSourceMaps.createSourceMapStore();
	return await sourceMapStore.transformCoverage(coverageMap);
}
/**
* Remove possible query parameters from filenames
* - From `/src/components/Header.component.ts?vue&type=script&src=true&lang.ts`
* - To `/src/components/Header.component.ts`
*/
function removeQueryParameters(filename) {
	return filename.split("?")[0];
}

export { IstanbulCoverageProvider };
