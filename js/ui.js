/*
 * JZING demo — interacción (equivale a assets/js/modules/ del tema, en scripts clásicos).
 */
( function () {
	'use strict';
	const JZ = window.JZ;
	const C = JZ.c;
	const e = JZ.esc;
	const UI = ( JZ.ui = {} );
	const reduceMotion = () => document.documentElement.dataset.motion === 'reduce' || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* Avisos ----------------------------------------------------------------- */
	UI.toast = ( message, { type = 'info', duration = 5000, action } = {} ) => {
		const region = document.querySelector( '[data-toasts]' );
		const item = document.createElement( 'div' );
		item.className = 'jz-toast jz-toast--' + type;
		item.setAttribute( 'role', type === 'error' ? 'alert' : 'status' );
		const p = document.createElement( 'p' );
		p.textContent = message;
		item.appendChild( p );
		if ( action ) {
			const b = document.createElement( 'button' );
			b.type = 'button';
			b.textContent = action.label;
			b.addEventListener( 'click', () => {
				action.onClick();
				item.remove();
			} );
			item.appendChild( b );
			duration = Math.max( duration, 8000 );
		}
		region.appendChild( item );
		setTimeout( () => item.remove(), duration );
	};
	const loginToast = ( msg ) => UI.toast( msg, { type: 'error', action: { label: 'Iniciar sesión', onClick: () => JZ.go( 'ingresar', { volver: location.hash.slice( 2 ) } ) } } );

	/* Foco en modales ---------------------------------------------------------- */
	const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
	const focusables = ( el ) => Array.from( el.querySelectorAll( FOCUSABLE ) ).filter( ( x ) => x.offsetParent !== null );
	function trap( container, ev ) {
		if ( ev.key !== 'Tab' ) {
			return;
		}
		const items = focusables( container );
		if ( ! items.length ) {
			return;
		}
		const first = items[ 0 ];
		const last = items[ items.length - 1 ];
		if ( ev.shiftKey && document.activeElement === first ) {
			ev.preventDefault();
			last.focus();
		} else if ( ! ev.shiftKey && document.activeElement === last ) {
			ev.preventDefault();
			first.focus();
		}
	}
	function inert( modal, on ) {
		const keep = modal.closest( 'body > *' ) || modal;
		Array.from( document.body.children ).forEach( ( el ) => {
			if ( el === keep || el.tagName === 'SCRIPT' ) {
				return;
			}
			if ( on && ! el.hasAttribute( 'inert' ) ) {
				el.setAttribute( 'inert', '' );
				el.dataset.jzInert = '1';
			} else if ( ! on && el.dataset.jzInert ) {
				el.removeAttribute( 'inert' );
				delete el.dataset.jzInert;
			}
		} );
	}

	/* Menú hamburguesa ------------------------------------------------------------ */
	const DESKTOP = window.matchMedia( '(min-width: 64em)' );
	let menuApi = null;
	UI.initNav = () => {
		const toggle = document.querySelector( '[data-menu-toggle]' );
		const menu = document.querySelector( '[data-mobile-menu]' );
		const panel = menu.querySelector( '[role="dialog"]' );
		let last = null;
		const onKey = ( ev ) => {
			if ( ev.key === 'Escape' ) {
				ev.preventDefault();
				close();
			} else {
				trap( panel, ev );
			}
		};
		function open() {
			last = document.activeElement;
			menu.hidden = false;
			void menu.offsetWidth;
			menu.classList.add( 'is-open' );
			toggle.setAttribute( 'aria-expanded', 'true' );
			document.body.classList.add( 'jz-lock' );
			inert( menu, true );
			const cur = panel.querySelector( '[aria-current="page"]' ) || focusables( panel )[ 0 ];
			requestAnimationFrame( () => cur && cur.focus() );
			document.addEventListener( 'keydown', onKey );
		}
		function close( { restore = true } = {} ) {
			if ( menu.hidden ) {
				return;
			}
			menu.classList.remove( 'is-open' );
			toggle.setAttribute( 'aria-expanded', 'false' );
			document.body.classList.remove( 'jz-lock' );
			inert( menu, false );
			document.removeEventListener( 'keydown', onKey );
			setTimeout( () => ( menu.hidden = true ), reduceMotion() ? 0 : 240 );
			if ( restore && last && document.contains( last ) ) {
				last.focus();
			}
		}
		toggle.addEventListener( 'click', () => ( menu.hidden ? open() : close() ) );
		menu.querySelectorAll( '[data-menu-close]' ).forEach( ( b ) => b.addEventListener( 'click', () => close() ) );
		menu.addEventListener( 'click', ( ev ) => {
			if ( ev.target.closest( 'a[href]' ) ) {
				close( { restore: false } );
			}
		} );
		// En la demo algunas acciones del menú son botones (p. ej. «Salir») que cambian de ruta sin recargar.
		window.addEventListener( 'hashchange', () => close( { restore: false } ) );
		DESKTOP.addEventListener( 'change', ( ev ) => {
			if ( ev.matches && ! document.documentElement.classList.contains( 'jz-nav-compact' ) ) {
				close( { restore: false } );
			}
		} );
		// Si con el texto ampliado la barra no cabe, se usa el menú hamburguesa también en escritorio.
		const inner = document.querySelector( '.jz-header__inner' );
		const root = document.documentElement;
		const fit = () => {
			root.classList.remove( 'jz-nav-compact' );
			if ( DESKTOP.matches && inner.scrollWidth > inner.clientWidth + 1 ) {
				root.classList.add( 'jz-nav-compact' );
			}
		};
		UI.checkFit = fit;
		fit();
		window.addEventListener( 'resize', () => requestAnimationFrame( fit ) );
		new MutationObserver( () => requestAnimationFrame( fit ) ).observe( root, { attributes: true, attributeFilter: [ 'data-scale', 'data-tracking', 'data-font' ] } );
		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( fit );
		}
		menuApi = { close };
	};
	const closeMenu = () => menuApi && menuApi.close( { restore: false } );

	/* Panel de accesibilidad ------------------------------------------------------- */
	const AKEY = 'jzing:a11y';
	const DEF = { theme: 'light', tint: 'none', scale: '1', tracking: 'normal', leading: 'normal', font: 'poppins', motion: '', links: '' };
	const SCALE = [ '90 %', '100 %', '112 %', '125 %', '150 %' ];
	const FONTS = { atkinson: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap', lexend: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap' };
	const readPrefs = () => {
		try {
			return { ...DEF, ...JSON.parse( localStorage.getItem( AKEY ) || '{}' ) };
		} catch ( x ) {
			return { ...DEF };
		}
	};
	function applyPrefs( p ) {
		const root = document.documentElement;
		Object.keys( DEF ).forEach( ( k ) => ( p[ k ] && p[ k ] !== DEF[ k ] ? root.setAttribute( 'data-' + k, p[ k ] ) : root.removeAttribute( 'data-' + k ) ) );
		if ( FONTS[ p.font ] && ! document.querySelector( `link[data-jz-font="${ p.font }"]` ) ) {
			const l = document.createElement( 'link' );
			l.rel = 'stylesheet';
			l.href = FONTS[ p.font ];
			l.dataset.jzFont = p.font;
			document.head.appendChild( l );
		}
	}
	UI.initA11y = () => {
		const wrap = document.querySelector( '[data-a11y-panel]' );
		const form = wrap.querySelector( '[data-a11y-form]' );
		const panel = wrap.querySelector( '[role="dialog"]' );
		const status = wrap.querySelector( '[data-a11y-status]' );
		const scale = form.elements.scale;
		const out = form.querySelector( '#jz-a11y-scale-out' );
		let prefs = readPrefs();
		let opener = null;
		applyPrefs( prefs );
		function sync() {
			[ 'theme', 'tint', 'tracking', 'leading', 'font' ].forEach( ( n ) => {
				const f = form.querySelector( `input[name="${ n }"][value="${ prefs[ n ] }"]` );
				if ( f ) {
					f.checked = true;
				}
			} );
			scale.value = prefs.scale;
			out.textContent = SCALE[ Number( prefs.scale ) ] || '100 %';
			scale.setAttribute( 'aria-valuetext', out.textContent );
			form.elements.motion.checked = prefs.motion === 'reduce';
			form.elements.links.checked = prefs.links === 'underline';
			form.querySelectorAll( 'input[name="tint"]' ).forEach( ( x ) => ( x.disabled = prefs.theme !== 'light' ) );
		}
		function update( patch, msg ) {
			prefs = { ...prefs, ...patch };
			applyPrefs( prefs );
			const diff = {};
			Object.keys( prefs ).forEach( ( k ) => {
				if ( prefs[ k ] && prefs[ k ] !== DEF[ k ] ) {
					diff[ k ] = prefs[ k ];
				}
			} );
			try {
				localStorage.setItem( AKEY, JSON.stringify( diff ) );
			} catch ( x ) {}
			sync();
			status.textContent = msg || '';
		}
		form.addEventListener( 'change', ( ev ) => {
			const t = ev.target;
			if ( t.type === 'radio' ) {
				update( { [ t.name ]: t.value }, 'Preferencia guardada: ' + t.closest( 'label' ).textContent.trim() );
			} else if ( t.name === 'motion' ) {
				update( { motion: t.checked ? 'reduce' : '' }, t.checked ? 'Animaciones reducidas' : 'Animaciones activadas' );
			} else if ( t.name === 'links' ) {
				update( { links: t.checked ? 'underline' : '' }, t.checked ? 'Enlaces subrayados' : 'Subrayado desactivado' );
			}
		} );
		scale.addEventListener( 'input', () => update( { scale: scale.value }, 'Tamaño del texto: ' + SCALE[ Number( scale.value ) ] ) );
		form.querySelectorAll( '[data-scale-step]' ).forEach( ( b ) => b.addEventListener( 'click', () => {
			const n = Math.min( 4, Math.max( 0, Number( prefs.scale ) + Number( b.dataset.scaleStep ) ) );
			update( { scale: String( n ) }, 'Tamaño del texto: ' + SCALE[ n ] );
		} ) );
		form.querySelector( '[data-a11y-reset]' ).addEventListener( 'click', () => update( { ...DEF }, 'Se restablecieron las preferencias predeterminadas' ) );
		const onKey = ( ev ) => {
			if ( ev.key === 'Escape' ) {
				ev.preventDefault();
				close();
			} else {
				trap( panel, ev );
			}
		};
		function open( trigger ) {
			closeMenu();
			opener = trigger || document.activeElement;
			sync();
			wrap.hidden = false;
			void wrap.offsetWidth;
			wrap.classList.add( 'is-open' );
			document.body.classList.add( 'jz-lock' );
			inert( wrap, true );
			document.querySelectorAll( '[data-a11y-open]' ).forEach( ( b ) => b.setAttribute( 'aria-expanded', 'true' ) );
			requestAnimationFrame( () => ( form.querySelector( 'input:checked' ) || panel ).focus() );
			document.addEventListener( 'keydown', onKey );
		}
		function close() {
			wrap.classList.remove( 'is-open' );
			document.body.classList.remove( 'jz-lock' );
			inert( wrap, false );
			document.querySelectorAll( '[data-a11y-open]' ).forEach( ( b ) => b.setAttribute( 'aria-expanded', 'false' ) );
			document.removeEventListener( 'keydown', onKey );
			setTimeout( () => ( wrap.hidden = true ), reduceMotion() ? 0 : 240 );
			const t = opener && document.contains( opener ) && opener.offsetParent !== null ? opener : document.querySelector( '.jz-a11y-trigger' );
			if ( t ) {
				t.focus();
			}
		}
		document.addEventListener( 'click', ( ev ) => {
			const b = ev.target.closest( '[data-a11y-open]' );
			if ( b ) {
				open( b );
			}
		} );
		wrap.querySelectorAll( '[data-a11y-close]' ).forEach( ( b ) => b.addEventListener( 'click', close ) );
	};

	/* Desplegables y preguntas frecuentes --------------------------------------------- */
	document.addEventListener( 'click', ( ev ) => {
		const b = ev.target.closest( '.jz-huella__info, [data-jz-disclosure]' );
		if ( ! b ) {
			return;
		}
		const p = document.getElementById( b.getAttribute( 'aria-controls' ) );
		if ( p ) {
			const open = b.getAttribute( 'aria-expanded' ) === 'true';
			b.setAttribute( 'aria-expanded', open ? 'false' : 'true' );
			p.hidden = open;
		}
	} );
	UI.bindFaq = ( root ) => {
		const faqs = Array.from( root.querySelectorAll( '[data-faq]' ) );
		faqs.forEach( ( item ) => item.addEventListener( 'toggle', () => {
			if ( item.open ) {
				faqs.forEach( ( o ) => o !== item && ( o.open = false ) );
			}
		} ) );
	};

	/* Voz (Web Speech API) ----------------------------------------------------------- */
	const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
	const VOICE_MSG = {
		unsupported: 'Tu navegador no admite la búsqueda por voz. Prueba con Chrome, Edge o Safari, o escribe tu búsqueda.',
		insecure: 'La búsqueda por voz requiere una conexión segura (HTTPS). Escribe tu búsqueda mientras tanto.',
		'not-allowed': 'No tenemos permiso para usar el micrófono. Actívalo en la configuración del navegador o escribe tu búsqueda.',
		'service-not-allowed': 'El navegador bloqueó el servicio de voz. Escribe tu búsqueda.',
		'no-speech': 'No escuchamos nada. Pulsa el micrófono e inténtalo de nuevo.',
		'audio-capture': 'No encontramos un micrófono. Conecta uno o escribe tu búsqueda.',
		network: 'El reconocimiento de voz necesita conexión a internet. Revisa tu conexión o escribe tu búsqueda.',
		'language-not-supported': 'El español (Perú) no está disponible en este navegador. Escribe tu búsqueda.',
		default: 'No pudimos reconocer tu voz. Inténtalo de nuevo o escribe tu búsqueda.',
	};
	function voiceSession( h ) {
		if ( ! Rec ) {
			return { start: () => h.onError( VOICE_MSG.unsupported ), stop() {}, active: () => false, ok: false };
		}
		if ( ! window.isSecureContext ) {
			return { start: () => h.onError( VOICE_MSG.insecure ), stop() {}, active: () => false, ok: false };
		}
		let rec = null;
		let active = false;
		let text = '';
		return {
			ok: true,
			active: () => active,
			stop: () => rec && active && rec.stop(),
			start() {
				rec = new Rec();
				rec.lang = 'es-PE';
				rec.interimResults = true;
				rec.continuous = false;
				text = '';
				rec.onstart = () => {
					active = true;
					h.onStart();
				};
				rec.onresult = ( ev ) => {
					let interim = '';
					for ( let n = ev.resultIndex; n < ev.results.length; n++ ) {
						if ( ev.results[ n ].isFinal ) {
							text += ev.results[ n ][ 0 ].transcript;
						} else {
							interim += ev.results[ n ][ 0 ].transcript;
						}
					}
					if ( interim ) {
						h.onInterim( ( text + interim ).trim() );
					}
				};
				rec.onerror = ( ev ) => ev.error !== 'aborted' && h.onError( VOICE_MSG[ ev.error ] || VOICE_MSG.default );
				rec.onend = () => {
					active = false;
					if ( text.trim() ) {
						h.onResult( text.trim() );
					}
					h.onEnd( !! text.trim() );
				};
				try {
					rec.start();
				} catch ( x ) {
					h.onError( VOICE_MSG.default );
				}
			},
		};
	}

	/* Buscador con sugerencias (combobox ARIA) -------------------------------------------- */
	let searchIndex = 0;
	UI.bindSearch = ( root ) => root.querySelectorAll( '[data-search]' ).forEach( ( box ) => {
		const input = box.querySelector( '[data-search-input]' );
		const panel = box.querySelector( '[data-search-panel]' );
		const list = box.querySelector( '[data-search-list]' );
		const status = box.querySelector( '[data-search-status]' );
		const interp = box.querySelector( '[data-search-interp]' );
		const all = box.querySelector( '[data-search-all]' );
		const voice = box.querySelector( '[data-voice]' );
		const type = box.dataset.searchType || 'todo';
		const idx = ++searchIndex;
		let options = [];
		let active = -1;
		let timer = 0;
		const setStatus = ( t, s = '' ) => {
			status.textContent = t;
			status.classList.toggle( 'is-error', s === 'error' );
			status.classList.toggle( 'is-listening', s === 'listening' );
		};
		const openP = () => {
			panel.hidden = false;
			input.setAttribute( 'aria-expanded', 'true' );
		};
		const closeP = () => {
			panel.hidden = true;
			input.setAttribute( 'aria-expanded', 'false' );
			input.removeAttribute( 'aria-activedescendant' );
			active = -1;
		};
		const hl = ( n ) => {
			options.forEach( ( o, k ) => o.setAttribute( 'aria-selected', k === n ? 'true' : 'false' ) );
			active = n;
			if ( n >= 0 && options[ n ] ) {
				input.setAttribute( 'aria-activedescendant', options[ n ].id );
				options[ n ].scrollIntoView( { block: 'nearest' } );
			} else {
				input.removeAttribute( 'aria-activedescendant' );
			}
		};
		function suggest( q, force ) {
			q = q.trim();
			if ( ! force && q.length < 3 ) {
				closeP();
				setStatus( q ? 'Escribe al menos 3 caracteres para ver sugerencias.' : '' );
				return;
			}
			const r = JZ.search( q, type, 6 );
			const parts = [];
			let n = 0;
			if ( r.cursos.length ) {
				parts.push( '<li class="jz-search__group" role="presentation">Cursos</li>' );
				r.cursos.forEach( ( c ) => parts.push( `<li role="option" id="jz-opt-${ idx }-${ n++ }" class="jz-search__option" data-url="#/cursos/${ e( c.slug ) }" aria-selected="false"><span class="jz-search__badge">${ C.icon( 'book' ) }</span><span><strong>${ e( c.title ) }</strong><small>${ e( c.code ) } · ${ JZ.plural( c.sections.length, 'sección', 'secciones' ) }</small></span></li>` ) );
			}
			if ( r.docentes.length ) {
				parts.push( '<li class="jz-search__group" role="presentation">Docentes</li>' );
				r.docentes.forEach( ( d ) => parts.push( `<li role="option" id="jz-opt-${ idx }-${ n++ }" class="jz-search__option" data-url="#/docentes/${ e( d.slug ) }" aria-selected="false"><span class="jz-avatar jz-avatar--md" aria-hidden="true">${ e( d.initials ) }</span><span><strong>${ e( d.name ) }</strong><small>${ e( d.courses.map( ( c ) => c.title ).slice( 0, 3 ).join( ', ' ) ) }</small></span></li>` ) );
			}
			if ( ! n ) {
				parts.push( `<li class="jz-search__empty" role="presentation">${ e( r.message ) }</li>` );
			}
			list.innerHTML = parts.join( '' );
			options = Array.from( list.querySelectorAll( '[role="option"]' ) );
			active = -1;
			interp.textContent = r.label ? 'Interpretamos: ' + r.label : '';
			if ( all ) {
				all.href = JZ.hash( 'buscar', { q } );
				all.hidden = ! n;
			}
			openP();
			setStatus( n ? `${ JZ.plural( n, 'sugerencia', 'sugerencias' ) }. Usa las flechas para elegir.` : r.message );
		}
		input.addEventListener( 'input', () => {
			clearTimeout( timer );
			timer = setTimeout( () => suggest( input.value ), 200 );
		} );
		input.addEventListener( 'keydown', ( ev ) => {
			if ( ev.key === 'ArrowDown' ) {
				if ( panel.hidden && input.value.trim().length >= 3 ) {
					suggest( input.value );
					return;
				}
				ev.preventDefault();
				hl( Math.min( options.length - 1, active + 1 ) );
			} else if ( ev.key === 'ArrowUp' ) {
				ev.preventDefault();
				hl( Math.max( -1, active - 1 ) );
			} else if ( ev.key === 'Enter' && active >= 0 && options[ active ] ) {
				ev.preventDefault();
				location.hash = options[ active ].dataset.url;
			} else if ( ev.key === 'Escape' && ! panel.hidden ) {
				ev.preventDefault();
				closeP();
			}
		} );
		list.addEventListener( 'click', ( ev ) => {
			const o = ev.target.closest( '[role="option"]' );
			if ( o ) {
				location.hash = o.dataset.url;
			}
		} );
		document.addEventListener( 'click', ( ev ) => ! box.contains( ev.target ) && closeP() );
		box.addEventListener( 'focusout', ( ev ) => ev.relatedTarget && ! box.contains( ev.relatedTarget ) && closeP() );
		if ( voice ) {
			const label = voice.querySelector( '[data-voice-label]' );
			const s = voiceSession( {
				onStart() {
					voice.setAttribute( 'aria-pressed', 'true' );
					label.textContent = 'Detener búsqueda por voz';
					setStatus( 'Escuchando… di, por ejemplo: «profesores de Cálculo».', 'listening' );
				},
				onInterim: ( t ) => ( input.value = t ),
				onResult( t ) {
					input.value = t;
					setStatus( `Entendimos: «${ t }». Puedes corregir el texto y volver a buscar.` );
					suggest( t, true );
					input.focus();
				},
				onError: ( m ) => setStatus( m, 'error' ),
				onEnd( got ) {
					voice.setAttribute( 'aria-pressed', 'false' );
					label.textContent = 'Buscar por voz';
					if ( ! got && status.classList.contains( 'is-listening' ) ) {
						setStatus( 'No escuchamos nada. Pulsa el micrófono e inténtalo de nuevo.', 'error' );
					}
				},
			} );
			if ( ! s.ok ) {
				voice.classList.add( 'is-unsupported' );
			}
			voice.addEventListener( 'click', () => ( s.active() ? s.stop() : s.start() ) );
		}
	} );

	/* Comparador ------------------------------------------------------------------------- */
	const CKEY = 'jzing:compare';
	const MAX = 3;
	const cLoad = () => {
		try {
			const d = JSON.parse( localStorage.getItem( CKEY ) || 'null' );
			if ( d && Array.isArray( d.items ) ) {
				return d;
			}
		} catch ( x ) {}
		return { type: '', courseId: 0, courseName: '', items: [] };
	};
	const cStore = ( s ) => {
		try {
			localStorage.setItem( CKEY, JSON.stringify( s ) );
		} catch ( x ) {}
		UI.renderCompare();
	};
	const noun = ( type, n ) => ( type === 'docentes' ? ( n === 1 ? 'docente' : 'docentes' ) : n === 1 ? 'sección' : 'secciones' );
	const cUrl = ( s ) => JZ.hash( 'comparar', s.items.length ? { tipo: s.type, ids: s.items.map( ( x ) => x.id ).join( ',' ) } : {} );
	UI.renderCompare = () => {
		const s = cLoad();
		document.querySelectorAll( '[data-compare-add]' ).forEach( ( b ) => {
			const on = s.type === b.dataset.type && s.items.some( ( x ) => String( x.id ) === b.dataset.id );
			b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			b.querySelector( '[data-compare-text]' ).textContent = on ? 'En el comparador' : 'Comparar';
		} );
		const tray = document.querySelector( '[data-compare-tray]' );
		const show = s.items.length > 0 && ! document.querySelector( '[data-compare-page]' );
		tray.hidden = ! show;
		document.body.classList.toggle( 'has-compare-tray', show );
		if ( show ) {
			tray.querySelector( '[data-compare-count]' ).textContent = `Comparador · ${ s.items.length } de ${ MAX } ${ noun( s.type, MAX ) }`;
			tray.querySelector( '[data-compare-items]' ).textContent = ( s.courseName ? s.courseName + ': ' : '' ) + s.items.map( ( x ) => x.label ).join( ' · ' );
			const go = tray.querySelector( '[data-compare-go]' );
			go.href = cUrl( s );
			go.setAttribute( 'aria-disabled', s.items.length < 2 ? 'true' : 'false' );
		}
	};
	function cRemove( id ) {
		const s = cLoad();
		s.items = s.items.filter( ( x ) => String( x.id ) !== String( id ) );
		if ( ! s.items.length ) {
			Object.assign( s, { type: '', courseId: 0, courseName: '' } );
		}
		cStore( s );
		return s;
	}
	function cAdd( b ) {
		let s = cLoad();
		const item = { id: Number( b.dataset.id ), label: b.dataset.label };
		const type = b.dataset.type;
		const courseId = Number( b.dataset.course || 0 );
		const courseName = b.dataset.courseName || '';
		const fresh = () => {
			cStore( { type, courseId, courseName, items: [ item ] } );
			UI.toast( `Nueva comparación: agregaste ${ item.label }.`, { type: 'success' } );
		};
		if ( s.items.length && ( s.type !== type || ( type === 'secciones' && s.courseId !== courseId ) ) ) {
			UI.toast( s.type !== type ? 'Tu comparador tiene otro tipo de elementos.' : `Solo puedes comparar secciones del mismo curso (tienes secciones de ${ s.courseName || 'otro curso' }).`, { type: 'error', action: { label: 'Empezar de nuevo', onClick: fresh } } );
			return;
		}
		if ( s.items.length >= MAX ) {
			UI.toast( `El comparador admite como máximo ${ MAX } ${ noun( type, MAX ) }. Quita uno para agregar otro.`, { type: 'error' } );
			return;
		}
		s = { type, courseId, courseName, items: [ ...s.items, item ] };
		cStore( s );
		UI.toast( `Agregaste ${ item.label } al comparador (${ s.items.length } de ${ MAX }).${ s.items.length < 2 ? ' Agrega al menos uno más para comparar.' : '' }` );
	}
	async function copy( text ) {
		try {
			await navigator.clipboard.writeText( text );
			return true;
		} catch ( x ) {
			const a = document.createElement( 'textarea' );
			a.value = text;
			a.style.position = 'fixed';
			a.style.opacity = '0';
			document.body.appendChild( a );
			a.select();
			const ok = document.execCommand && document.execCommand( 'copy' );
			a.remove();
			return !! ok;
		}
	}
	UI.bindComparePage = ( root ) => {
		const page = root.querySelector( '[data-compare-page]' );
		if ( ! page ) {
			return;
		}
		const ids = page.dataset.ids.split( ',' ).filter( Boolean );
		const table = page.querySelector( '.jz-compare' );
		if ( ids.length && table ) {
			const names = Array.from( table.querySelectorAll( 'thead .jz-compare__name' ) ).map( ( a ) => a.textContent.trim() );
			const kick = Array.from( table.querySelectorAll( 'thead .jz-chip' ) ).map( ( c ) => c.textContent.trim() );
			cStore( { type: page.dataset.type, courseId: Number( page.dataset.courseId || 0 ), courseName: page.dataset.courseName || '', items: ids.map( ( id, n ) => ( { id: Number( id ), label: page.dataset.type === 'secciones' ? `${ kick[ n ] } · ${ names[ n ] }` : names[ n ] } ) ) } );
		} else {
			const s = cLoad();
			const resume = page.querySelector( '[data-compare-resume]' );
			if ( resume && s.items.length ) {
				resume.innerHTML = `<a class="jz-btn jz-btn--primary" href="${ cUrl( s ) }">Ver tu comparación guardada (${ JZ.plural( s.items.length, noun( s.type, 1 ), noun( s.type, 2 ) ) })</a>`;
				resume.hidden = false;
			}
		}
		page.querySelectorAll( '[data-compare-remove]' ).forEach( ( l ) => l.addEventListener( 'click', () => cRemove( l.dataset.compareRemove ) ) );
		const only = page.querySelector( '[data-only-diff]' );
		if ( only ) {
			only.addEventListener( 'change', () => {
				table.classList.toggle( 'only-diff', only.checked );
				UI.toast( only.checked ? `Se ocultaron ${ table.querySelectorAll( 'tr[data-diff="0"]' ).length } filas con valores similares (diferencia menor a 0,5).` : 'Se muestran todas las filas.' );
			} );
		}
		const share = root.querySelector( '[data-share]' );
		if ( share ) {
			share.querySelector( '[data-share-copy]' ).addEventListener( 'click', async () => {
				const ok = await copy( share.dataset.shareUrl );
				UI.toast( ok ? 'Enlace copiado. En esta demo solo abre la comparación en una computadora que tenga la demo.' : 'No pudimos copiar. Copia la dirección desde la barra del navegador.', { type: ok ? 'success' : 'error' } );
			} );
		}
	};

	/* Reseñas (SIMULADAS con localStorage) ---------------------------------------------------- */
	UI.bindReviewForm = ( root ) => {
		const form = root.querySelector( '[data-review-form]' );
		if ( ! form ) {
			return;
		}
		const summary = root.querySelector( '[data-form-summary]' );
		const sumList = root.querySelector( '[data-form-summary-list]' );
		const range = form.querySelector( '[data-teoria-range]' );
		const rOut = form.querySelector( '[data-teoria-out]' );
		const comment = form.querySelector( '[data-comment]' );
		const counter = form.querySelector( '[data-comment-count]' );
		const editId = form.dataset.editId;
		const syncRange = () => {
			rOut.textContent = `${ range.value } % teoría · ${ 100 - range.value } % práctica`;
			range.setAttribute( 'aria-valuetext', rOut.textContent );
		};
		const syncCounter = () => {
			const n = comment.value.trim().length;
			counter.textContent = `${ n } de 500 caracteres${ n < 30 ? ' (mínimo 30)' : '' }`;
			counter.classList.toggle( 'is-invalid', n > 0 && ( n < 30 || n > 500 ) );
		};
		const syncPreview = () => {
			const bits = [ form.elements.autor_carrera.value, Number( form.elements.autor_ciclo.value ) ? `ciclo ${ form.elements.autor_ciclo.value }` : '' ].filter( Boolean );
			form.querySelector( '[data-preview-text]' ).textContent = bits.length ? `Estudiante de ${ bits.join( ', ' ) }` : 'Estudiante (datos no indicados)';
		};
		range.addEventListener( 'input', syncRange );
		comment.addEventListener( 'input', syncCounter );
		form.elements.autor_carrera.addEventListener( 'change', syncPreview );
		form.elements.autor_ciclo.addEventListener( 'change', syncPreview );
		syncRange();
		syncCounter();
		syncPreview();
		const fieldFor = ( k ) => ( k === 'curso_id' ? form.elements.target : k.startsWith( 'dim_' ) ? form.querySelector( `input[name="${ k }"]` ) : k === 'periodo' ? form.elements.periodo : k === 'comentario' ? comment : form.querySelector( `input[name="${ k }"]` ) );
		form.addEventListener( 'submit', ( ev ) => {
			ev.preventDefault();
			form.querySelectorAll( '[data-error-for]' ).forEach( ( x ) => {
				x.hidden = true;
				x.textContent = '';
			} );
			form.querySelectorAll( '[aria-invalid]' ).forEach( ( x ) => x.removeAttribute( 'aria-invalid' ) );
			form.querySelectorAll( '.jz-rating.is-invalid' ).forEach( ( x ) => x.classList.remove( 'is-invalid' ) );
			sumList.innerHTML = '';
			const fd = new FormData( form );
			const st = JZ.store.get();
			const existing = editId ? st.reviews.find( ( r ) => r.id === editId ) : null;
			const [ doc, cur ] = ( existing ? `${ existing.docente }:${ existing.course }` : form.elements.target.value || ':' ).split( ':' );
			const dims = {};
			JZ.DIM_KEYS.forEach( ( k ) => ( dims[ k ] = Number( fd.get( 'dim_' + k ) || 0 ) ) );
			const data = {
				docente: Number( doc ) || 0, course: Number( cur ) || 0, period: existing ? existing.period : fd.get( 'periodo' ) || '', dims,
				respeta: fd.get( 'respeta_horario' ) === null ? '' : Number( fd.get( 'respeta_horario' ) ),
				fechas: fd.get( 'fechas_anticipadas' ) === null ? '' : Number( fd.get( 'fechas_anticipadas' ) ),
				vivo: fd.get( 'herramientas_vivo' ) ? 1 : 0, evals: fd.getAll( 'evaluaciones' ), trabajo: fd.get( 'modalidad_trabajo' ) || '',
				teoria: Number( fd.get( 'teoria_pct' ) ), comment: String( fd.get( 'comentario' ) || '' ).trim(),
				carrera: fd.get( 'autor_carrera' ) || '', ciclo: Number( fd.get( 'autor_ciclo' ) || 0 ),
			};
			const errors = JZ.validateReview( data, !! existing );
			if ( errors.length ) {
				errors.forEach( ( er ) => {
					const holder = form.querySelector( `[data-error-for="${ er.key }"]` );
					const f = fieldFor( er.key );
					if ( holder ) {
						holder.textContent = er.message;
						holder.hidden = false;
					}
					if ( f ) {
						const g = f.closest( '.jz-rating' );
						if ( g ) {
							g.classList.add( 'is-invalid' );
						} else {
							f.setAttribute( 'aria-invalid', 'true' );
						}
					}
					const li = document.createElement( 'li' );
					if ( f && f.id ) {
						const a = document.createElement( 'a' );
						a.href = '#' + f.id;
						a.textContent = er.message;
						a.addEventListener( 'click', ( x ) => {
							x.preventDefault();
							f.focus();
						} );
						li.appendChild( a );
					} else {
						li.textContent = er.message;
						if ( er.key === 'general' ) {
							li.innerHTML += ' <a href="#/mis-resenas">Ir a «Mis reseñas»</a>';
						}
					}
					sumList.appendChild( li );
				} );
				summary.hidden = false;
				summary.focus();
				return;
			}
			if ( existing ) {
				Object.assign( existing, data, { status: 'pending', editada: true } );
			} else {
				st.reviews.push( { ...data, id: 'demo-' + st.seq++, author: JZ.user().id, status: 'pending', util: 0, date: new Date().toISOString().slice( 0, 10 ), editada: false } );
			}
			JZ.store.save();
			JZ.go( 'mis-resenas', { estado: existing ? 'editada' : 'enviada' } );
		} );
	};

	function reportDialog( id, button ) {
		const dialog = document.querySelector( '[data-report-dialog]' );
		const form = dialog.querySelector( 'form' );
		const err = dialog.querySelector( '[data-report-error]' );
		form.reset();
		err.hidden = true;
		dialog.showModal();
		form.onsubmit = ( ev ) => {
			ev.preventDefault();
			const reason = form.querySelector( 'input[name="motivo"]:checked' );
			if ( ! reason ) {
				err.textContent = 'Elige un motivo para el reporte.';
				err.hidden = false;
				form.querySelector( 'input[name="motivo"]' ).focus();
				return;
			}
			const st = JZ.store.get();
			const rep = st.reports[ id ] || { count: 0, reasons: [] };
			rep.count++;
			rep.reasons.push( reason.value );
			st.reports[ id ] = rep;
			let hidden = false;
			if ( rep.count >= 3 ) {
				st.hidden[ id ] = true;
				hidden = true;
			}
			JZ.store.save();
			dialog.close();
			button.disabled = true;
			button.querySelector( 'span' ).textContent = 'Reportada';
			UI.toast( hidden ? 'Gracias. La reseña alcanzó 3 reportes y se ocultó hasta su revisión.' : 'Gracias. Enviamos tu reporte al equipo de moderación (simulado: aparece en el panel de Moderación de esta demo).', { type: 'success', duration: 7000 } );
			if ( hidden ) {
				button.closest( '[data-review-id]' ).remove();
			}
		};
		dialog.querySelector( '[data-report-cancel]' ).onclick = () => dialog.close();
		dialog.onclose = () => button.isConnected && button.focus();
	}

	/* Acciones globales por delegación --------------------------------------------------------- */
	document.addEventListener( 'click', ( ev ) => {
		const t = ev.target;
		let b;
		if ( ( b = t.closest( '[data-compare-add]' ) ) ) {
			if ( b.getAttribute( 'aria-pressed' ) === 'true' ) {
				cRemove( b.dataset.id );
				UI.toast( `Quitaste ${ b.dataset.label } del comparador.` );
			} else {
				cAdd( b );
			}
		} else if ( t.closest( '[data-compare-clear]' ) ) {
			cStore( { type: '', courseId: 0, courseName: '', items: [] } );
			UI.toast( 'Vaciaste el comparador.' );
		} else if ( ( b = t.closest( '[data-compare-go]' ) ) && b.getAttribute( 'aria-disabled' ) === 'true' ) {
			ev.preventDefault();
			UI.toast( 'Agrega al menos dos opciones para comparar.', { type: 'error' } );
		} else if ( ( b = t.closest( '[data-review-helpful]' ) ) ) {
			if ( ! JZ.user() ) {
				loginToast( 'Inicia sesión para marcar reseñas como útiles.' );
				return;
			}
			const id = b.closest( '[data-review-id]' ).dataset.reviewId;
			const st = JZ.store.get();
			const on = ! st.helpful[ id ];
			if ( on ) {
				st.helpful[ id ] = true;
			} else {
				delete st.helpful[ id ];
			}
			JZ.store.save();
			const cnt = b.querySelector( '[data-helpful-count]' );
			cnt.textContent = Number( cnt.textContent ) + ( on ? 1 : -1 );
			b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			UI.toast( on ? 'Marcaste esta reseña como útil.' : 'Quitaste tu marca de «Útil».' );
		} else if ( ( b = t.closest( '[data-review-report]' ) ) ) {
			if ( ! JZ.user() ) {
				loginToast( 'Inicia sesión para reportar una reseña.' );
				return;
			}
			reportDialog( b.closest( '[data-review-id]' ).dataset.reviewId, b );
		} else if ( ( b = t.closest( '[data-review-delete]' ) ) ) {
			// eslint-disable-next-line no-alert
			if ( window.confirm( '¿Eliminar esta reseña? Esta acción la retira de la plataforma y recalcula la evaluación del docente.' ) ) {
				const st = JZ.store.get();
				st.reviews = st.reviews.filter( ( r ) => r.id !== b.dataset.reviewDelete );
				JZ.store.save();
				UI.toast( 'Eliminamos tu reseña.', { type: 'success' } );
				JZ.render();
			}
		} else if ( ( b = t.closest( '[data-moderate]' ) ) ) {
			const st = JZ.store.get();
			const id = b.dataset.id;
			const local = st.reviews.find( ( r ) => r.id === id );
			const act = b.dataset.moderate;
			if ( act === 'approve' ) {
				if ( local ) {
					local.status = 'publish';
				}
				delete st.hidden[ id ];
			} else if ( act === 'keep' ) {
				delete st.reports[ id ];
				delete st.hidden[ id ];
			} else {
				st.hidden[ id ] = true;
			}
			JZ.store.save();
			UI.toast( { approve: 'Reseña aprobada y publicada: ya cuenta en la huella del docente.', keep: 'Reseña mantenida; reportes cerrados.', hide: 'Reseña ocultada. En el proyecto real se avisa al autor por correo.' }[ act ], { type: 'success' } );
			JZ.render();
		} else if ( ( b = t.closest( '[data-login]' ) ) ) {
			JZ.store.get().user = JZ.USERS[ b.dataset.login ];
			JZ.store.save();
			UI.renderAccount();
			UI.toast( `Iniciaste sesión como ${ JZ.store.get().user.name } (simulado).`, { type: 'success' } );
			location.hash = '#/' + ( b.dataset.volver || '' );
		} else if ( t.closest( '[data-logout]' ) ) {
			JZ.store.get().user = null;
			JZ.store.save();
			UI.renderAccount();
			UI.toast( 'Cerraste sesión.' );
			location.hash = '#/';
		} else if ( t.closest( '[data-demo-reset]' ) ) {
			// eslint-disable-next-line no-alert
			if ( window.confirm( '¿Reiniciar la demostración? Se borran la sesión, las reseñas creadas, marcas, reportes y el comparador de este navegador.' ) ) {
				JZ.store.reset();
				location.reload();
			}
		}
	} );

	/* Cuenta en la cabecera ---------------------------------------------------------------- */
	UI.renderAccount = () => {
		const u = JZ.user();
		const html = u
			? `<a class="jz-btn jz-btn--ghost jz-btn--sm" href="#/mis-resenas">${ C.icon( 'user' ) }<span>Mis reseñas</span></a>${ u.role === 'moderador' ? '<a class="jz-btn jz-btn--ghost jz-btn--sm" href="#/moderacion"><span>Moderación</span></a>' : '' }<button type="button" class="jz-btn jz-btn--tertiary jz-btn--sm" data-logout>${ C.icon( 'logout' ) }<span>Salir (${ e( u.name ) })</span></button>`
			: '<a class="jz-btn jz-btn--secondary jz-btn--sm" href="#/ingresar">Iniciar sesión</a><a class="jz-btn jz-btn--primary jz-btn--sm" href="#/ingresar">Crear cuenta</a>';
		document.querySelectorAll( '[data-account]' ).forEach( ( el ) => ( el.innerHTML = html ) );
		if ( UI.checkFit ) {
			requestAnimationFrame( UI.checkFit );
		}
	};

	/* JZING Assistant (SIMULADO; en el proyecto real es Botpress Webchat) ------------------------ */
	UI.initAssistant = () => {
		const fab = document.getElementById( 'jzing-assistant-toggle' );
		const chat = document.querySelector( '[data-chat]' );
		const log = chat.querySelector( '[data-chat-log]' );
		const form = chat.querySelector( '[data-chat-form]' );
		const input = form.elements.mensaje;
		const sugg = chat.querySelector( '[data-chat-suggestions]' );
		let ctx = { docente: 0 };
		let started = false;
		function addMsg( who, html ) {
			const m = document.createElement( 'div' );
			m.className = 'jz-chat__msg jz-chat__msg--' + who;
			m.innerHTML = `<span class="screen-reader-text">${ who === 'bot' ? 'JZING Assistant dice:' : 'Tú:' }</span>${ html }`;
			log.appendChild( m );
			log.scrollTop = log.scrollHeight;
		}
		function setSugg( list ) {
			sugg.innerHTML = list.map( ( s ) => `<button type="button" class="jz-chat__chip" data-chat-ask="${ e( s ) }">${ e( s ) }</button>` ).join( '' );
		}
		function respond( text ) {
			addMsg( 'user', `<p>${ e( text ) }</p>` );
			const typing = document.createElement( 'div' );
			typing.className = 'jz-chat__msg jz-chat__msg--bot jz-chat__typing';
			typing.innerHTML = '<span></span><span></span><span></span><span class="screen-reader-text">Escribiendo…</span>';
			log.appendChild( typing );
			log.scrollTop = log.scrollHeight;
			const page = JZ.currentRoute && JZ.currentRoute.path[ 0 ] === 'docentes' && JZ.currentRoute.path[ 1 ] ? JZ.docente( JZ.currentRoute.path[ 1 ] ) : null;
			if ( page && /\b(este|esta)\s+(profesor|profesora|docente|profe)/i.test( text ) && ! ctx.docente ) {
				ctx.docente = page.id;
			}
			setTimeout( () => {
				typing.remove();
				const r = JZ.assistantRespond( text, ctx );
				ctx = r.ctx;
				const body = e( r.text ).replace( /\n/g, '<br>' );
				const links = r.links.length ? `<ul class="jz-chat__links">${ r.links.map( ( [ t, u ] ) => `<li><a href="${ e( u ) }">${ e( t ) }</a></li>` ).join( '' ) }</ul>` : '';
				addMsg( 'bot', `<p>${ body }</p>${ links }` );
				setSugg( r.suggestions.length ? r.suggestions : JZ.assistantSuggestions );
			}, reduceMotion() ? 0 : 450 );
		}
		const onKey = ( ev ) => {
			if ( ev.key === 'Escape' ) {
				ev.preventDefault();
				close();
			}
		};
		function open( ask ) {
			chat.hidden = false;
			fab.setAttribute( 'aria-expanded', 'true' );
			fab.setAttribute( 'aria-label', 'Cerrar JZING Assistant' );
			if ( ! started ) {
				started = true;
				addMsg( 'bot', '<p>¡Hola! Soy <strong>JZING Assistant</strong>. Puedo buscar cursos y docentes, mostrar evaluaciones por dimensiones y explicarte cómo comparar secciones.</p>' );
				setSugg( JZ.assistantSuggestions );
			}
			document.addEventListener( 'keydown', onKey );
			if ( ask && ask !== 'Hola' ) {
				respond( ask );
			}
			requestAnimationFrame( () => input.focus() );
		}
		function close() {
			chat.hidden = true;
			fab.setAttribute( 'aria-expanded', 'false' );
			fab.setAttribute( 'aria-label', 'Abrir JZING Assistant' );
			document.removeEventListener( 'keydown', onKey );
			fab.focus();
		}
		fab.addEventListener( 'click', () => ( chat.hidden ? open() : close() ) );
		chat.querySelector( '[data-chat-close]' ).addEventListener( 'click', close );
		form.addEventListener( 'submit', ( ev ) => {
			ev.preventDefault();
			const v = input.value.trim();
			if ( v ) {
				input.value = '';
				respond( v );
			}
		} );
		document.addEventListener( 'click', ( ev ) => {
			const b = ev.target.closest( '[data-chat-ask], [data-assistant-ask]' );
			if ( b ) {
				const q = b.dataset.chatAsk || b.dataset.assistantAsk;
				if ( chat.hidden ) {
					open( q );
				} else {
					respond( q );
				}
			}
		} );
	};
}() );
