/*
 * JZING demo — enrutador por hash (#/ruta/slug?parametros) y arranque.
 * Usa hash para funcionar al abrir index.html directamente (file://), sin servidor.
 */
( function () {
	'use strict';
	const JZ = window.JZ;
	const P = JZ.pages;
	const UI = JZ.ui;
	const main = document.getElementById( 'contenido' );
	const SECTIONS = { 'como-funciona': 1, dimensiones: 1, preguntas: 1 };

	function parse() {
		const raw = decodeURI( location.hash.replace( /^#\/?/, '' ) );
		const [ pathPart, query = '' ] = raw.split( '?' );
		return { path: pathPart.split( '/' ).filter( Boolean ), params: new URLSearchParams( query ), raw };
	}

	function pick( r ) {
		const [ a, b ] = r.path;
		switch ( a ) {
			case undefined:
			case 'inicio':
				return P.home( r );
			case 'cursos':
				return b ? P.curso( r ) : P.cursos( r );
			case 'docentes':
				return b ? P.docente( r ) : P.docentes( r );
			case 'comparar':
				return P.comparar( r );
			case 'buscar':
				return P.buscar( r );
			case 'publicar-resena':
				return P.publicar( r );
			case 'mis-resenas':
				return P.misResenas( r );
			case 'ingresar':
				return P.ingresar( r );
			case 'moderacion':
				return P.moderacion( r );
			case 'accesibilidad':
				return P.accesibilidad( r );
			case 'acerca-demo':
				return P.demo( r );
			default:
				return P.notFound( r );
		}
	}

	const NAV = { '': '', inicio: '', cursos: 'cursos', docentes: 'docentes', comparar: 'comparar', 'publicar-resena': 'publicar-resena' };
	function markNav( r ) {
		const key = NAV[ r.path[ 0 ] || '' ];
		document.querySelectorAll( '.jz-nav__list a' ).forEach( ( a ) => {
			const on = key !== undefined && a.dataset.nav === key;
			a.toggleAttribute( 'aria-current', on );
			if ( on ) {
				a.setAttribute( 'aria-current', 'page' );
			}
			a.parentElement.classList.toggle( 'current-menu-item', on );
		} );
		const brand = document.querySelector( '.jz-header .jz-brand' );
		if ( ! r.path.length ) {
			brand.setAttribute( 'aria-current', 'page' );
		} else {
			brand.removeAttribute( 'aria-current' );
		}
	}

	let lastPath = null;
	JZ.render = ( opts = {} ) => {
		const r = parse();
		JZ.currentRoute = r;
		let out;
		try {
			out = pick( r );
		} catch ( err ) {
			// eslint-disable-next-line no-console
			console.error( err );
			out = { title: 'Error — JZING', html: '<div class="jz-container jz-page-body"><p class="jz-alert jz-alert--error" role="alert">Ocurrió un error al mostrar esta página de la demo. <a href="#/">Volver al inicio</a></p></div>' };
		}
		main.innerHTML = out.html;
		document.title = out.title;
		markNav( r );
		UI.bindSearch( main );
		UI.bindFaq( main );
		UI.bindComparePage( main );
		UI.bindReviewForm( main );
		UI.renderCompare();

		const pathKey = r.path.join( '/' );
		const section = r.path[ 0 ] === 'inicio' && SECTIONS[ r.path[ 1 ] ] ? document.getElementById( r.path[ 1 ] ) : null;
		const behavior = 'auto';
		if ( section ) {
			section.scrollIntoView( { behavior } );
			section.focus( { preventScroll: true } );
		} else if ( opts.initial ) {
			// Primera carga: no mover el foco.
		} else if ( opts.scrollTo && document.getElementById( opts.scrollTo ) ) {
			const t = document.getElementById( opts.scrollTo );
			t.scrollIntoView( { behavior } );
			t.focus( { preventScroll: true } );
		} else if ( pathKey !== lastPath || ! opts.keepScroll ) {
			window.scrollTo( 0, 0 );
			main.focus( { preventScroll: true } );
		}
		lastPath = pathKey;
	};

	// Navega a una ruta con parámetros.
	JZ.go = ( path, params ) => {
		const h = JZ.hash( path, params );
		if ( location.hash === h ) {
			JZ.render();
		} else {
			location.hash = h;
		}
	};

	let pendingScroll = null;
	window.addEventListener( 'hashchange', () => {
		const s = pendingScroll;
		pendingScroll = null;
		JZ.render( { scrollTo: s } );
	} );

	// Formularios de filtros: convierten los campos en parámetros del hash.
	document.addEventListener( 'submit', ( ev ) => {
		const form = ev.target.closest( '[data-route-form]' );
		if ( ! form ) {
			return;
		}
		ev.preventDefault();
		const params = {};
		new FormData( form ).forEach( ( v, k ) => {
			v = String( v ).trim();
			if ( v !== '' && v !== '0' ) {
				params[ k ] = v;
			}
		} );
		if ( form.dataset.routeForm === 'buscar' && ! params.q ) {
			form.querySelector( '[name="q"]' ).focus();
			return;
		}
		if ( form.dataset.routeForm.startsWith( 'docentes/' ) && form.querySelector( '[name="rcurso"]' ) ) {
			pendingScroll = 'resenas';
		}
		JZ.go( form.dataset.routeForm, params );
	} );

	// Enlaces internos que no son rutas (#contenido, #jz-target…): desplazar y enfocar sin cambiar de página.
	document.addEventListener( 'click', ( ev ) => {
		const a = ev.target.closest( 'a[href^="#"]' );
		if ( ! a || ev.defaultPrevented ) {
			return;
		}
		const href = a.getAttribute( 'href' );
		if ( href.startsWith( '#/' ) ) {
			if ( a.dataset.scroll ) {
				pendingScroll = a.dataset.scroll;
			}
			if ( href === location.hash ) {
				ev.preventDefault();
				JZ.render( { scrollTo: pendingScroll } );
				pendingScroll = null;
			}
			return;
		}
		ev.preventDefault();
		const t = document.getElementById( href.slice( 1 ) );
		if ( t ) {
			if ( ! t.hasAttribute( 'tabindex' ) && ! /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test( t.tagName ) ) {
				t.setAttribute( 'tabindex', '-1' );
			}
			t.scrollIntoView();
			t.focus( { preventScroll: true } );
		}
	} );

	// Arranque: íconos SVG del marco fijo (cabecera, paneles, pie).
	document.querySelectorAll( '[data-icon]' ).forEach( ( el ) => {
		el.outerHTML = JZ.c.icon( el.dataset.icon, el.dataset.iconClass || '' );
	} );
	UI.initNav();
	UI.initA11y();
	UI.initAssistant();
	UI.renderAccount();
	JZ.render( { initial: true } );
}() );
