/*
 * JZING demo — componentes visuales (equivalen a inc/template-tags.php y template-parts/ del tema).
 * Todo texto variable pasa por JZ.esc() antes de insertarse en el HTML.
 */
( function () {
	'use strict';
	const JZ = window.JZ;
	const e = JZ.esc;
	const C = ( JZ.c = {} );

	const ICONS = {
		search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
		mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
		menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
		close: '<path d="M6 6l12 12M18 6 6 18"/>',
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
		star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
		check: '<path d="m5 12 4.5 4.5L19 7"/>',
		alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
		info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
		clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
		calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
		columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
		chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
		a11y: '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5M9 21l3-6 3 6"/>',
		book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
		users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
		shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
		chevron: '<path d="m6 9 6 6 6-6"/>',
		arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
		plus: '<path d="M12 5v14M5 12h14"/>',
		minus: '<path d="M5 12h14"/>',
		trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
		edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
		flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
		thumb: '<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 6.5A2 2 0 0 1 17.3 20H7"/>',
		copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
		layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
		logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
		filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
		briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
		whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/>',
		send: '<path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/>',
		monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
	};
	C.icon = ( name, cls = '' ) => ICONS[ name ] ? `<svg class="jz-icon ${ cls }" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ ICONS[ name ] }</svg>` : '';
	const i = C.icon;
	let uid = 0;
	C.uid = ( p ) => `${ p }-${ ++uid }`;

	C.badge = ( text, variant = 'neutral', icon = '' ) => `<span class="jz-badge jz-badge--${ variant }">${ icon ? i( icon ) : '' }<span>${ e( text ) }</span></span>`;
	C.demoBadge = () => C.badge( 'Dato demostrativo', 'demo', 'info' );
	C.sim = ( text = 'Simulado en esta demo' ) => `<span class="jz-badge jz-badge--sim" title="Esta función se simula con JavaScript y localStorage. En el proyecto real usa WordPress y MySQL.">${ i( 'monitor' ) }<span>${ e( text ) }</span></span>`;
	C.avatar = ( initials, size = 'md' ) => `<span class="jz-avatar jz-avatar--${ size }" aria-hidden="true">${ e( initials ) }</span>`;

	C.reliability = ( info, explain = false ) => {
		const map = { alta: [ 'success', 'shield' ], media: [ 'warning', 'info' ], baja: [ 'neutral', 'alert' ] };
		const [ v, ic ] = map[ info.level ] || map.baja;
		if ( ! explain ) {
			return C.badge( info.label, v, ic );
		}
		const id = C.uid( 'jz-rel' );
		return `<span class="jz-reliability"><button type="button" class="jz-badge jz-badge--${ v } jz-badge--button" aria-expanded="false" aria-controls="${ id }" data-jz-disclosure>${ i( ic ) }<span>${ e( info.label ) }</span>${ i( 'chevron', 'jz-icon--sm' ) }</button><span class="jz-reliability__explain" id="${ id }" hidden>${ e( info.explain ) }</span></span>`;
	};
	C.apta = ( ok ) => {
		if ( ! ok ) {
			return '';
		}
		const id = C.uid( 'jz-apta' );
		return `<span class="jz-reliability"><button type="button" class="jz-badge jz-badge--info jz-badge--button" aria-expanded="false" aria-controls="${ id }" data-jz-disclosure>${ i( 'briefcase' ) }<span>Apta para quienes trabajan</span></button><span class="jz-reliability__explain" id="${ id }" hidden>Criterio: flexibilidad de 4 o más y carga de trabajo de 3 o menos, con confiabilidad media o alta.</span></span>`;
	};

	/* Huella de enseñanza: 7 barras × 5 segmentos con valor */
	C.huella = ( stats, opts = {} ) => {
		const compact = opts.variant === 'compact';
		const id = opts.id || C.uid( 'jz-huella' );
		const counts = opts.counts !== false;
		const rows = JZ.DIMS.map( ( dim ) => {
			const d = ( stats && stats.dims[ dim.key ] ) || { avg: null, count: 0, enough: false };
			const val = d.enough ? d.avg : null;
			const segs = [ 1, 2, 3, 4, 5 ].map( ( n ) => `<span class="jz-seg" style="--fill:${ val == null ? 0 : Math.round( Math.max( 0, Math.min( 1, val - ( n - 1 ) ) ) * 100 ) }%"></span>` ).join( '' );
			const did = `${ id }-desc-${ dim.key }`;
			const label = compact
				? `<abbr title="${ e( dim.label ) }">${ e( dim.short ) }</abbr>`
				: `<button type="button" class="jz-huella__info" aria-expanded="false" aria-controls="${ did }"><span>${ e( dim.label ) }</span>${ i( 'info' ) }<span class="screen-reader-text">¿qué significa?</span></button>`;
			let value;
			if ( val != null ) {
				value = `<strong class="jz-num">${ JZ.num( val ) }</strong><span class="screen-reader-text"> de 5</span>${ counts && ! compact ? `<small class="jz-huella__count">${ JZ.plural( d.count, 'reseña', 'reseñas' ) }</small>` : '' }`;
			} else {
				value = compact ? '<small class="jz-huella__na">S/D</small><span class="screen-reader-text">datos insuficientes</span>' : '<small class="jz-huella__na">Datos insuficientes</small>';
			}
			const desc = compact ? '' : `<p class="jz-huella__desc" id="${ did }" hidden>${ e( dim.description ) }<span class="jz-huella__scale">1 = ${ e( dim.low ) } · 5 = ${ e( dim.high ) }</span></p>`;
			return `<li class="jz-huella__row${ val == null ? ' is-empty' : '' }" data-dim="${ dim.key }"><span class="jz-huella__label">${ label }</span><span class="jz-huella__bar" aria-hidden="true">${ segs }</span><span class="jz-huella__value">${ value }</span>${ desc }</li>`;
		} ).join( '' );
		return `<ul class="jz-huella${ compact ? ' jz-huella--compact' : '' }" role="list" id="${ id }">${ rows }</ul>`;
	};

	C.splitBar = ( t ) => {
		if ( t == null ) {
			return '<p class="jz-muted">Datos insuficientes sobre la proporción de teoría y práctica.</p>';
		}
		return `<div class="jz-split" role="img" aria-label="${ t } % teoría, ${ 100 - t } % práctica"><span class="jz-split__a" style="width:${ t }%"></span><span class="jz-split__b" style="width:${ 100 - t }%"></span></div><p class="jz-split__legend" aria-hidden="true"><span><i class="jz-dot jz-dot--a"></i>${ t } % teoría</span><span><i class="jz-dot jz-dot--b"></i>${ 100 - t } % práctica</span></p>`;
	};

	C.compareBtn = ( type, id, label, courseId = 0, courseName = '' ) => `<button type="button" class="jz-btn jz-btn--secondary jz-btn--sm" data-compare-add data-type="${ type }" data-id="${ id }" data-label="${ e( label ) }" data-course="${ courseId }" data-course-name="${ e( courseName ) }" aria-pressed="false">${ i( 'columns' ) }<span data-compare-text>Comparar</span></button>`;

	C.empty = ( title, text, url = '', action = '', icon = 'search' ) => `<div class="jz-empty" role="status"><span class="jz-empty__icon">${ i( icon ) }</span><p class="jz-empty__title">${ e( title ) }</p><p class="jz-empty__text">${ e( text ) }</p>${ url ? `<a class="jz-btn jz-btn--secondary" href="${ e( url ) }">${ e( action ) }</a>` : '' }</div>`;

	C.crumbs = ( items ) => `<nav class="jz-breadcrumbs" aria-label="Ruta de navegación"><ol>${ items.map( ( [ t, u ], n ) => ( n === items.length - 1 || ! u ? `<li><span aria-current="page">${ e( t ) }</span></li>` : `<li><a href="${ e( u ) }">${ e( t ) }</a></li>` ) ).join( '' ) }</ol></nav>`;

	C.sessions = ( sessions ) => {
		if ( ! sessions || ! sessions.length ) {
			return '<p class="jz-muted">Horario por confirmar</p>';
		}
		const types = { teoria: 'Teoría', practica: 'Práctica', laboratorio: 'Laboratorio' };
		return `<ul class="jz-sessions" role="list">${ sessions.map( ( s ) => `<li><span class="jz-session-type jz-session-type--${ e( s.tipo ) }">${ types[ s.tipo ] || e( s.tipo ) }</span> ${ JZ.DAY_LONG[ s.dia ] } ${ e( s.inicio ) }–${ e( s.fin ) }${ s.lugar ? ` · <span class="jz-muted">${ e( s.lugar ) }</span>` : '' }</li>` ).join( '' ) }</ul>`;
	};

	/* Buscador con sugerencias y voz (mismo marcado que template-parts/search-form.php) */
	C.searchForm = ( o = {} ) => {
		const id = o.id || C.uid( 'jz-search' );
		const label = o.label || 'Buscar cursos y docentes';
		return `<form class="jz-search jz-search--${ o.size || 'md' }" role="search" data-search data-search-type="${ o.type || 'todo' }" data-route-form="buscar">
			<label class="jz-search__label" for="${ id }">${ e( label ) }</label>
			<div class="jz-search__field">${ i( 'search', 'jz-search__icon' ) }
				<input type="search" id="${ id }" name="q" value="${ e( o.value || '' ) }" placeholder="${ e( o.placeholder || 'Curso, código o docente. Ej.: Base de Datos' ) }" autocomplete="off" spellcheck="false" maxlength="120" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${ id }-list" aria-describedby="${ id }-status" data-search-input>
				<button type="button" class="jz-search__voice" data-voice aria-pressed="false" aria-describedby="${ id }-status">${ i( 'mic' ) }<span class="screen-reader-text" data-voice-label>Buscar por voz</span></button>
				<button type="submit" class="jz-btn jz-btn--primary jz-search__submit"><span>Buscar</span></button>
			</div>
			<p class="jz-search__status" id="${ id }-status" aria-live="polite" data-search-status></p>
			<div class="jz-search__panel" data-search-panel hidden><p class="jz-search__interp" data-search-interp></p><ul class="jz-search__list" id="${ id }-list" role="listbox" aria-label="Sugerencias" data-search-list></ul><a class="jz-search__all" href="#/buscar" data-search-all>Ver todos los resultados</a></div>
		</form>`;
	};
	C.searchInline = ( o = {} ) => {
		const id = C.uid( 'jz-inline-search' );
		return `<div class="jz-field jz-search jz-search--inline" data-search data-search-type="${ o.type || 'todo' }">
			<label class="jz-search__label" for="${ id }">${ e( o.label || 'Buscar' ) }</label>
			<div class="jz-search__field">${ i( 'search', 'jz-search__icon' ) }
				<input type="search" id="${ id }" name="q" value="${ e( o.value || '' ) }" placeholder="${ e( o.placeholder || 'Ej.: Algoritmos o JZ-AE201' ) }" autocomplete="off" maxlength="120" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${ id }-list" aria-describedby="${ id }-status" data-search-input>
				<button type="button" class="jz-search__voice" data-voice aria-pressed="false" aria-describedby="${ id }-status">${ i( 'mic' ) }<span class="screen-reader-text" data-voice-label>Buscar por voz</span></button>
			</div>
			<p class="jz-search__status" id="${ id }-status" aria-live="polite" data-search-status></p>
			<div class="jz-search__panel" data-search-panel hidden><p class="jz-search__interp" data-search-interp></p><ul class="jz-search__list" id="${ id }-list" role="listbox" aria-label="Sugerencias" data-search-list></ul></div>
		</div>`;
	};

	/* Tarjetas ------------------------------------------------------------ */
	C.courseCard = ( c, h = 'h3' ) => `<article class="jz-card jz-card--course">
		<div class="jz-card__top"><span class="jz-chip jz-chip--code">${ e( c.code ) }</span>${ c.ciclo ? `<span class="jz-chip">Ciclo ${ c.ciclo }</span>` : '' }${ C.demoBadge() }</div>
		<${ h } class="jz-card__title"><a class="jz-card__link" href="#/cursos/${ e( c.slug ) }">${ e( c.title ) }</a></${ h }>
		<p class="jz-card__text">${ e( c.excerpt ) }</p>
		<dl class="jz-meta"><div><dt>Secciones este ciclo</dt><dd class="jz-num">${ c.sections.length }</dd></div><div><dt>Créditos</dt><dd class="jz-num">${ c.credits }</dd></div></dl>
		${ c.docentes.length ? `<p class="jz-card__people">${ i( 'users' ) }<span><span class="screen-reader-text">Docentes: </span>${ e( c.docentes.map( ( d ) => d.name ).join( ', ' ) ) }</span></p>` : '<p class="jz-card__people jz-muted">Sin secciones registradas en el ciclo actual.</p>' }
		<ul class="jz-tags" role="list" aria-label="Carreras">${ c.careerNames.slice( 0, 3 ).map( ( n ) => `<li>${ e( n ) }</li>` ).join( '' ) }</ul>
	</article>`;

	C.docenteCard = ( d, h = 'h3' ) => {
		const s = d.stats;
		return `<article class="jz-card jz-card--docente">
		<div class="jz-card__head">${ C.avatar( d.initials ) }<div><${ h } class="jz-card__title"><a class="jz-card__link" href="#/docentes/${ e( d.slug ) }">${ e( d.name ) }</a></${ h }><p class="jz-card__sub">${ e( [ d.area, d.grado ].filter( Boolean ).join( ' · ' ) ) }</p></div></div>
		<div class="jz-card__badges">${ s.count ? C.reliability( d.rel ) : C.badge( 'Sin reseñas aún', 'neutral', 'info' ) }${ C.apta( s.apta_trabajo ) }${ C.demoBadge() }</div>
		<ul class="jz-tags" role="list" aria-label="Cursos que dicta">${ d.courses.map( ( c ) => `<li>${ e( c.title ) }</li>` ).join( '' ) }</ul>
		${ s.count ? `<p class="jz-card__caption">Huella según ${ JZ.plural( s.count, 'reseña', 'reseñas' ) }</p>${ C.huella( s, { variant: 'compact' } ) }` : '' }
		<div class="jz-card__actions"><a class="jz-btn jz-btn--primary jz-btn--sm" href="#/docentes/${ e( d.slug ) }">Ver perfil<span class="screen-reader-text"> ${ e( d.name ) }</span></a>${ C.compareBtn( 'docentes', d.id, d.name ) }</div>
	</article>`;
	};

	C.sectionCard = ( s ) => {
		const st = s.stats;
		const has = st.count > 0;
		const url = `#/docentes/${ e( s.docenteObj.slug ) }?curso=${ s.course }`;
		return `<article class="jz-card jz-card--section" data-section-id="${ s.id }">
		<div class="jz-card__top"><span class="jz-chip jz-chip--accent">Sección ${ e( s.code ) }</span>${ has ? C.reliability( s.rel ) : '' }${ C.apta( has && st.apta_trabajo ) }</div>
		<h3 class="jz-card__title"><a class="jz-card__link" href="${ url }">${ e( s.docenteObj.name ) }</a></h3>
		<p class="jz-card__schedule">${ i( 'clock' ) }<span>${ e( s.schedule ) }</span></p>
		${ C.sessions( s.sessions ) }
		${ has ? `<p class="jz-card__caption">Huella en este curso · ${ JZ.plural( st.count, 'reseña', 'reseñas' ) }</p>${ C.huella( st, { variant: 'compact' } ) }<p class="jz-card__facts">${ st.practica_pct != null ? `<span>Práctica ${ st.practica_pct } %</span>` : '' }${ st.respeta_horario != null ? `<span>Respeta el horario: ${ st.respeta_horario } %</span>` : '' }</p>` : `<p class="jz-muted jz-card__nodata">${ i( 'info' ) } Aún no hay reseñas de este docente en este curso.</p>` }
		<div class="jz-card__actions"><a class="jz-btn jz-btn--primary jz-btn--sm" href="${ url }">Ver docente<span class="screen-reader-text"> ${ e( s.docenteObj.name ) }</span></a>${ C.compareBtn( 'secciones', s.id, `${ s.code } · ${ s.docenteObj.name }`, s.course, s.courseObj.title ) }</div>
	</article>`;
	};

	C.reviewItem = ( r ) => {
		const course = JZ.courseSummary( r.course );
		const bits = [ r.carrera, r.ciclo ? `ciclo ${ r.ciclo }` : '' ].filter( Boolean );
		const mine = JZ.user() && r.author === JZ.user().id;
		return `<article class="jz-review" data-review-id="${ e( r.id ) }">
		<header class="jz-review__head"><div class="jz-review__badges">${ course ? `<span class="jz-chip">${ e( course.title ) }</span>` : '' }<span class="jz-chip jz-chip--outline">Ciclo ${ e( r.period ) }</span>${ JZ.periods.old( r.period ) ? C.badge( 'Reseña antigua', 'warning', 'clock' ) : '' }${ r.editada ? C.badge( 'Editada', 'neutral', 'edit' ) : '' }${ r.author ? C.sim( 'Creada en esta demo' ) : C.demoBadge() }</div>
		<p class="jz-review__author">${ bits.length ? `Estudiante de ${ e( bits.join( ', ' ) ) }` : 'Estudiante (datos no indicados)' }</p></header>
		<blockquote class="jz-review__text"><p>${ e( r.comment ) }</p></blockquote>
		<ul class="jz-review__dims" role="list" aria-label="Valoraciones de esta reseña">${ JZ.DIMS.map( ( d ) => `<li><abbr title="${ e( d.label ) }">${ e( d.short ) }</abbr> <strong class="jz-num">${ r.dims[ d.key ] }</strong><span class="screen-reader-text"> de 5</span></li>` ).join( '' ) }</ul>
		<p class="jz-review__facts">${ r.evals.length ? `<span>Evaluaciones: ${ e( r.evals.map( ( x ) => JZ.EVAL_LABELS[ x ] || x ).join( ', ' ) ) }</span>` : '' }<span>${ r.respeta ? 'Respetaba el horario' : 'No siempre respetaba el horario' }</span></p>
		<footer class="jz-review__actions">${ mine
		? `<span class="jz-muted">Tu reseña</span><span class="jz-review__count">${ i( 'thumb' ) } <span class="jz-num">${ r.util }</span> <span>útil</span></span>`
		: `<button type="button" class="jz-btn jz-btn--ghost jz-btn--sm" data-review-helpful aria-pressed="${ r.utilMine ? 'true' : 'false' }">${ i( 'thumb' ) }<span>Útil</span> <span class="jz-num" data-helpful-count>${ r.util }</span><span class="screen-reader-text"> personas marcaron esta reseña como útil</span></button><button type="button" class="jz-btn jz-btn--tertiary jz-btn--sm" data-review-report ${ r.reported ? 'disabled' : '' }>${ i( 'flag' ) }<span>${ r.reported ? 'Reportada' : 'Reportar' }</span></button>` }</footer>
	</article>`;
	};
}() );
