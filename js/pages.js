/*
 * JZING demo — páginas (equivalen a las plantillas PHP del tema JZING).
 * Cada función recibe la ruta y devuelve { title, html }.
 */
( function () {
	'use strict';
	const JZ = window.JZ;
	const C = JZ.c;
	const e = JZ.esc;
	const i = C.icon;
	const P = ( JZ.pages = {} );
	const home = [ 'Inicio', '#/' ];

	const head = ( crumbs, title, lead = '', narrow = false, extra = '' ) => `<div class="jz-page-head"><div class="jz-container${ narrow ? ' jz-container--narrow' : '' }">${ C.crumbs( crumbs ) }<h1 class="jz-page-title">${ title }</h1>${ lead ? `<p class="jz-lead">${ lead }</p>` : '' }${ extra }</div></div>`;
	const chipRemove = ( text, href ) => `<li><a class="jz-chip jz-chip--removable" href="${ e( href ) }">${ e( text ) }${ i( 'close' ) }<span class="screen-reader-text">Quitar filtro</span></a></li>`;
	JZ.hash = ( path, params ) => {
		const q = new URLSearchParams();
		Object.entries( params || {} ).forEach( ( [ k, v ] ) => {
			if ( v !== '' && v != null && v !== 0 && v !== '0' ) {
				q.set( k, v );
			}
		} );
		const s = q.toString();
		return '#/' + path + ( s ? '?' + s : '' );
	};

	/* Portada ------------------------------------------------------------------ */
	P.home = () => {
		const example = { dims: {} };
		[ 4.6, 4.1, 3.2, 3.6, 4.4, 3.8, 4.2 ].forEach( ( v, n ) => ( example.dims[ JZ.DIM_KEYS[ n ] ] = { avg: v, count: 38, enough: true } ) );
		const courses = JZ.courses();
		const docs = JZ.docentes();
		const faq = {
			Privacidad: [
				[ '¿Mi nombre será visible?', 'No. Las reseñas públicas muestran solo la carrera y el ciclo que indiques (puedes omitirlos). Tu identidad solo la ve el equipo de moderación para atender reportes.' ],
				[ '¿Qué guardan mis preferencias de accesibilidad?', 'Solo ajustes visuales (tema, tamaño de letra, espaciado, tipografía), guardados en tu navegador. No se envían al servidor.' ],
			],
			Evaluaciones: [
				[ '¿Cómo se calcula la huella de enseñanza?', 'Cada dimensión es el promedio de las reseñas publicadas, en escala del 1 al 5. Si una dimensión tiene menos de 3 reseñas, mostramos "Datos insuficientes" en lugar de un número.' ],
				[ '¿Qué significa la confiabilidad?', 'Indica cuántas reseñas recientes respaldan la evaluación: alta con 20 o más de los dos últimos ciclos, media de 8 a 19 y baja con menos de 8.' ],
				[ '¿Por qué no hay un ranking de mejores docentes?', 'Porque el docente ideal depende de cada estudiante: su horario, su ritmo y su forma de aprender. JZING muestra información por dimensiones para que tú decidas.' ],
			],
			Uso: [
				[ '¿JZING reemplaza la matrícula oficial?', 'No. JZING es un proyecto académico independiente y no es un servicio oficial de la UPC. La matrícula se realiza en el sistema oficial de la universidad.' ],
				[ '¿Cómo comparo secciones?', 'En la ficha de un curso, pulsa «Comparar» en dos o tres secciones y luego «Comparar ahora». Puedes mostrar solo las diferencias y compartir el enlace.' ],
				[ '¿Qué hago si una reseña es ofensiva?', 'Usa el botón «Reportar» de la reseña y elige el motivo. Con tres reportes, la reseña se oculta hasta que moderación la revise.' ],
			],
		};
		return { title: 'JZING — Elige la sección que encaja contigo', html: `
<section class="jz-hero" aria-labelledby="jz-hero-title"><div class="jz-container jz-hero__grid">
	<div class="jz-hero__copy">
		<p class="jz-kicker"><span class="jz-highlight">Ingeniería · Ciclo ${ e( JZ.PERIOD ) }</span></p>
		<h1 id="jz-hero-title" class="jz-hero__title">Elige la sección que encaja con tu forma de aprender y con tu horario</h1>
		<p class="jz-hero__text">Compara docentes, carga de trabajo y experiencias de otros estudiantes antes de matricularte. Sin rankings: tú decides con información por dimensiones.</p>
		${ C.searchForm( { id: 'jz-hero-search', size: 'lg', label: '¿Qué curso o docente buscas?' } ) }
		<div class="jz-hero__actions">
			<a class="jz-btn jz-btn--primary" href="#/cursos">${ i( 'book' ) }<span>Explorar cursos</span></a>
			<a class="jz-btn jz-btn--secondary" href="#/docentes">${ i( 'users' ) }<span>Ver docentes</span></a>
			<a class="jz-btn jz-btn--tertiary" href="#/inicio/como-funciona">Ver cómo funciona</a>
		</div>
		<ul class="jz-hero__trust" role="list"><li>${ i( 'check' ) }Sin rankings de "mejores" docentes</li><li>${ i( 'check' ) }Reseñas anónimas y moderadas</li></ul>
	</div>
	<aside class="jz-hero__card jz-card jz-card--raised" aria-labelledby="jz-example-title">
		<div class="jz-card__top"><span class="jz-chip jz-chip--accent">Sección 2A</span>${ C.badge( 'Datos de ejemplo', 'demo', 'info' ) }</div>
		<h2 class="jz-card__title" id="jz-example-title">Así se ve una huella de enseñanza</h2>
		<p class="jz-card__sub">Toca una dimensión para ver qué significa.</p>
		${ C.huella( example, { id: 'jz-example-huella' } ) }
		<p class="jz-card__caption">Valores del 1 al 5. En carga de trabajo, un valor alto significa más carga.</p>
	</aside>
</div></section>
<section class="jz-band" aria-label="JZING en números"><div class="jz-container"><ul class="jz-band__stats" role="list">
	<li><strong class="jz-num">${ docs.length }</strong><span>docentes</span></li><li><strong class="jz-num">${ courses.length }</strong><span>cursos</span></li>
	<li><strong class="jz-num">${ JZ.publishedReviews().length }</strong><span>reseñas publicadas</span></li><li><strong class="jz-num">7</strong><span>dimensiones</span></li>
</ul></div></section>
<section class="jz-section" id="como-funciona" aria-labelledby="jz-how-title" tabindex="-1"><div class="jz-container">
	<p class="jz-eyebrow">Cómo funciona</p><h2 class="jz-section__title" id="jz-how-title">De la búsqueda a una decisión informada</h2>
	<ol class="jz-steps" role="list">
		<li class="jz-step"><span class="jz-step__num" aria-hidden="true">01</span>${ i( 'search' ) }<h3>Busca tu curso</h3><p>Escribe o dicta el nombre, el código o el docente. Verás las secciones del ciclo.</p></li>
		<li class="jz-step"><span class="jz-step__num" aria-hidden="true">02</span>${ i( 'layers' ) }<h3>Revisa la huella</h3><p>Siete dimensiones de enseñanza, cómo evalúa y su confiabilidad según las reseñas.</p></li>
		<li class="jz-step"><span class="jz-step__num" aria-hidden="true">03</span>${ i( 'columns' ) }<h3>Compara secciones</h3><p>Pon dos o tres secciones lado a lado y mira dónde se diferencian más.</p></li>
		<li class="jz-step"><span class="jz-step__num" aria-hidden="true">04</span>${ i( 'chat' ) }<h3>Comparte tu experiencia</h3><p>Al terminar el ciclo, deja una reseña por dimensiones para ayudar a otros.</p></li>
	</ol>
</div></section>
<section class="jz-section jz-section--alt" id="dimensiones" aria-labelledby="jz-dims-title" tabindex="-1"><div class="jz-container jz-split-section">
	<div><p class="jz-eyebrow">Siete dimensiones</p><h2 class="jz-section__title" id="jz-dims-title">Una huella de enseñanza, no una sola nota</h2><p class="jz-lead">Un puntaje único no te dice si un docente explica con claridad o si su ritmo encaja contigo. Por eso cada evaluación se separa en dimensiones y siempre ves cuántas reseñas la respaldan.</p></div>
	<dl class="jz-dims-list">${ JZ.DIMS.map( ( d ) => `<div class="jz-dims-list__item"><dt>${ e( d.label ) }</dt><dd>${ e( d.description ) }</dd></div>` ).join( '' ) }</dl>
</div></section>
<section class="jz-section" aria-labelledby="jz-trust-title"><div class="jz-container">
	<p class="jz-eyebrow">Reseñas responsables</p><h2 class="jz-section__title" id="jz-trust-title">Opiniones útiles, cuidando a estudiantes y docentes</h2>
	<ol class="jz-trust" role="list">
		<li>${ i( 'user' ) }<div><h3>Cuenta registrada</h3><p>Para reseñar necesitas iniciar sesión. Una reseña por curso y ciclo.</p></div></li>
		<li>${ i( 'shield' ) }<div><h3>Tu nombre no se muestra</h3><p>El público solo ve la carrera y el ciclo que decidas indicar.</p></div></li>
		<li>${ i( 'flag' ) }<div><h3>Moderación</h3><p>Las reseñas se revisan antes de publicarse y cualquiera puede reportar una reseña inapropiada.</p></div></li>
	</ol>
	<p class="jz-muted jz-trust__note">Importante: JZING no está integrado con los sistemas de la UPC, por lo que no puede certificar que el autor llevó el curso. <a href="#/inicio/preguntas">¿Mi nombre será visible?</a></p>
</div></section>
<section class="jz-section jz-section--alt" aria-labelledby="jz-quick-title"><div class="jz-container">
	<div class="jz-section__head"><div><p class="jz-eyebrow">Empieza a explorar</p><h2 class="jz-section__title" id="jz-quick-title">Cursos y docentes</h2></div><a class="jz-link-arrow" href="#/cursos">Ver todos los cursos${ i( 'arrow' ) }</a></div>
	<div class="jz-grid jz-grid--3">${ courses.slice( 0, 6 ).map( ( c ) => C.courseCard( c ) ).join( '' ) }</div>
	<div class="jz-section__head jz-section__head--spaced"><h3 class="jz-subtitle">Algunos docentes</h3><a class="jz-link-arrow" href="#/docentes">Ver todos los docentes${ i( 'arrow' ) }</a></div>
	<div class="jz-grid jz-grid--3">${ docs.slice( 0, 3 ).map( ( d ) => C.docenteCard( d, 'h4' ) ).join( '' ) }</div>
</div></section>
<section class="jz-section" id="preguntas" aria-labelledby="jz-faq-title" tabindex="-1"><div class="jz-container jz-container--narrow">
	<p class="jz-eyebrow">Preguntas frecuentes</p><h2 class="jz-section__title" id="jz-faq-title">Resolvemos tus dudas</h2>
	${ Object.entries( faq ).map( ( [ g, items ] ) => `<h3 class="jz-faq__group">${ g }</h3><div class="jz-faq">${ items.map( ( [ q, a ] ) => `<details class="jz-faq__item" name="jz-faq" data-faq><summary class="jz-faq__q"><span>${ q }</span>${ i( 'chevron' ) }</summary><div class="jz-faq__a"><p>${ a }</p></div></details>` ).join( '' ) }</div>` ).join( '' ) }
</div></section>
<section class="jz-section jz-cta" aria-labelledby="jz-cta-title"><div class="jz-container jz-cta__inner">
	<div><h2 class="jz-cta__title" id="jz-cta-title">¿Tienes dudas? Pregúntale a JZING Assistant</h2><p>Busca docentes de un curso, pregunta qué cursos dicta un profesor o cómo interpretar una evaluación.</p><p class="jz-cta__sim">${ C.sim( 'Asistente simulado en esta demo' ) }</p></div>
	<div class="jz-cta__actions">
		<button type="button" class="jz-btn jz-btn--highlight" data-assistant-ask="Hola">${ i( 'chat' ) }<span>Abrir el asistente</span></button>
		<button type="button" class="jz-chip jz-chip--button" data-assistant-ask="Busca docentes de Base de Datos">«Busca docentes de Base de Datos»</button>
		<button type="button" class="jz-chip jz-chip--button" data-assistant-ask="¿Cómo interpreto las evaluaciones?">«¿Cómo interpreto las evaluaciones?»</button>
	</div>
</div></section>` };
	};

	/* Catálogo de cursos ---------------------------------------------------------- */
	P.cursos = ( r ) => {
		const q = r.params.get( 'q' ) || '';
		const carrera = r.params.get( 'carrera' ) || '';
		const ciclo = Number( r.params.get( 'ciclo' ) || 0 );
		const items = JZ.courses( { q, carrera, ciclo } );
		const filtered = q || carrera || ciclo;
		const base = { q, carrera, ciclo };
		const without = ( k ) => JZ.hash( 'cursos', { ...base, [ k ]: '' } );
		return { title: 'Cursos — JZING', html: `${ head( [ home, [ 'Cursos' ] ], 'Explora cursos', `Busca por nombre o código y revisa las secciones y docentes del ciclo ${ e( JZ.PERIOD ) }.` ) }
<div class="jz-container jz-page-body"><div class="jz-layout-filters">
	<aside class="jz-filters" aria-labelledby="jz-filters-title"><form class="jz-filters__form" data-route-form="cursos">
		<h2 class="jz-filters__title" id="jz-filters-title">${ i( 'filter' ) } Filtros</h2>
		${ C.searchInline( { value: q, type: 'cursos', label: 'Nombre o código del curso' } ) }
		<div class="jz-field"><label for="jz-f-carrera">Carrera</label><select id="jz-f-carrera" name="carrera"><option value="">Todas las carreras</option>${ JZ.careers().map( ( c ) => `<option value="${ e( c.slug ) }" ${ c.slug === carrera ? 'selected' : '' }>${ e( c.name ) }</option>` ).join( '' ) }</select></div>
		<div class="jz-field"><label for="jz-f-ciclo">Ciclo de la malla</label><select id="jz-f-ciclo" name="ciclo"><option value="0">Todos los ciclos</option>${ Array.from( { length: 10 }, ( _, n ) => `<option value="${ n + 1 }" ${ ciclo === n + 1 ? 'selected' : '' }>Ciclo ${ n + 1 }</option>` ).join( '' ) }</select></div>
		<div class="jz-filters__actions"><button type="submit" class="jz-btn jz-btn--primary jz-btn--block">Aplicar filtros</button>${ filtered ? '<a class="jz-btn jz-btn--tertiary jz-btn--block" href="#/cursos">Limpiar</a>' : '' }</div>
	</form></aside>
	<section class="jz-results" aria-labelledby="jz-results-title">
		<div class="jz-results__head"><h2 class="jz-results__title" id="jz-results-title" aria-live="polite">${ JZ.plural( items.length, 'curso encontrado', 'cursos encontrados' ) }</h2>
		${ filtered ? `<ul class="jz-active-filters" role="list" aria-label="Filtros activos">${ q ? chipRemove( `«${ q }»`, without( 'q' ) ) : '' }${ carrera ? chipRemove( JZ.careerName( carrera ), without( 'carrera' ) ) : '' }${ ciclo ? chipRemove( `Ciclo ${ ciclo }`, without( 'ciclo' ) ) : '' }</ul>` : '' }</div>
		${ items.length ? `<div class="jz-grid jz-grid--2">${ items.map( ( c ) => C.courseCard( c ) ).join( '' ) }</div>` : C.empty( 'No encontramos ese curso', q ? `No hay cursos que coincidan con «${ q }». Revisa el código o prueba con menos palabras.` : 'No hay cursos con estos filtros.', '#/cursos', 'Ver todos los cursos' ) }
	</section>
</div></div>` };
	};

	/* Ficha de curso --------------------------------------------------------------- */
	P.curso = ( r ) => {
		const c = JZ.course( r.path[ 1 ] );
		if ( ! c ) {
			return P.notFound();
		}
		const min = {};
		JZ.DIM_KEYS.forEach( ( k ) => {
			const v = Number( r.params.get( 'min_' + k ) || 0 );
			if ( v >= 1 && v <= 5 ) {
				min[ k ] = v;
			}
		} );
		const orden = JZ.DIM_KEYS.includes( r.params.get( 'orden' ) ) ? r.params.get( 'orden' ) : '';
		const apta = r.params.get( 'apta' ) === '1';
		let sections = c.sections.filter( ( s ) => ( ! apta || s.stats.apta_trabajo ) && Object.entries( min ).every( ( [ k, v ] ) => s.stats.dims[ k ].avg != null && s.stats.dims[ k ].avg >= v ) );
		if ( orden ) {
			const asc = ! JZ.higherIsBetter( orden );
			sections = sections.slice().sort( ( a, b ) => {
				const va = a.stats.dims[ orden ].avg;
				const vb = b.stats.dims[ orden ].avg;
				if ( va == null || vb == null ) {
					return va == null ? ( vb == null ? 0 : 1 ) : -1;
				}
				return asc ? va - vb : vb - va;
			} );
		}
		const hidden = c.sections.length - sections.length;
		const filtered = Object.keys( min ).length || apta;
		const current = { orden, apta: apta ? 1 : '' };
		Object.entries( min ).forEach( ( [ k, v ] ) => ( current[ 'min_' + k ] = v ) );
		const path = 'cursos/' + c.slug;
		const dimLabel = Object.fromEntries( JZ.DIMS.map( ( d ) => [ d.key, d.label ] ) );
		return { title: `${ c.title } — JZING`, html: `
<div class="jz-page-head"><div class="jz-container">${ C.crumbs( [ home, [ 'Cursos', '#/cursos' ], [ c.title ] ] ) }
	<div class="jz-course-head"><div class="jz-card__top"><span class="jz-chip jz-chip--code">${ e( c.code ) }</span><span class="jz-chip">Ciclo ${ c.ciclo }</span><span class="jz-chip">${ JZ.plural( c.credits, 'crédito', 'créditos' ) }</span>${ C.demoBadge() }</div>
	<h1 class="jz-page-title">${ e( c.title ) }</h1><p class="jz-muted">${ e( c.careerNames.join( ' · ' ) ) }</p></div>
	<div class="jz-prose jz-course-desc"><p>${ e( c.content ) }</p></div>
</div></div>
<div class="jz-container jz-page-body"><div class="jz-layout-filters">
	<aside class="jz-filters" aria-labelledby="jz-sec-filters"><form class="jz-filters__form" data-route-form="${ e( path ) }">
		<h2 class="jz-filters__title" id="jz-sec-filters">${ i( 'filter' ) } Filtrar secciones</h2>
		<fieldset class="jz-fieldset jz-fieldset--compact"><legend>Valor mínimo por dimensión</legend><p class="jz-fieldset__hint">Combina varias. Las secciones sin datos suficientes en esa dimensión se ocultan.</p>
		${ JZ.DIMS.map( ( d ) => `<div class="jz-field jz-field--row"><label for="jz-min-${ d.key }">${ e( d.label ) }</label><select id="jz-min-${ d.key }" name="min_${ d.key }"><option value="">Cualquiera</option>${ [ 2, 3, 4, 5 ].map( ( v ) => `<option value="${ v }" ${ min[ d.key ] === v ? 'selected' : '' }>≥ ${ v }</option>` ).join( '' ) }</select></div>` ).join( '' ) }
		</fieldset>
		<label class="jz-switch" for="jz-apta"><input type="checkbox" id="jz-apta" name="apta" value="1" role="switch" ${ apta ? 'checked' : '' }><span class="jz-switch__track" aria-hidden="true"></span><span>Solo aptas para quienes trabajan</span></label>
		<div class="jz-field"><label for="jz-orden">Ordenar por</label><select id="jz-orden" name="orden"><option value="">Código de sección</option>${ JZ.DIMS.map( ( d ) => `<option value="${ d.key }" ${ orden === d.key ? 'selected' : '' }>${ d.key === 'carga' ? 'Carga de trabajo (menor primero)' : e( d.label ) + ' (mayor primero)' }</option>` ).join( '' ) }</select><p class="jz-fieldset__hint">No existe orden por puntaje general: elige la dimensión que más te importa.</p></div>
		<div class="jz-filters__actions"><button type="submit" class="jz-btn jz-btn--primary jz-btn--block">Aplicar</button>${ filtered || orden ? `<a class="jz-btn jz-btn--tertiary jz-btn--block" href="#/${ e( path ) }">Limpiar</a>` : '' }</div>
	</form></aside>
	<section class="jz-results" id="secciones" aria-labelledby="jz-sections-title" tabindex="-1">
		<div class="jz-results__head"><h2 class="jz-results__title" id="jz-sections-title">${ JZ.plural( sections.length, 'sección', 'secciones' ) } en ${ e( JZ.PERIOD ) }</h2>
		<p class="jz-results__order">Orden: ${ orden ? e( dimLabel[ orden ] ) : 'código de sección' }</p>
		${ filtered ? `<p class="jz-alert jz-alert--info" role="status">${ i( 'info' ) }<span>${ JZ.plural( hidden, 'sección oculta', 'secciones ocultas' ) } por los filtros.</span></p><ul class="jz-active-filters" role="list" aria-label="Filtros activos">${ Object.entries( min ).map( ( [ k, v ] ) => chipRemove( `${ dimLabel[ k ] } ≥ ${ v }`, JZ.hash( path, { ...current, [ 'min_' + k ]: '' } ) ) ).join( '' ) }${ apta ? chipRemove( 'Apta para quienes trabajan', JZ.hash( path, { ...current, apta: '' } ) ) : '' }</ul>` : '' }</div>
		${ sections.length ? `<div class="jz-grid jz-grid--2">${ sections.map( C.sectionCard ).join( '' ) }</div>` : c.sections.length ? C.empty( 'Ninguna sección cumple los filtros', 'Prueba con un valor mínimo más bajo o quita algún filtro.', '#/' + path, 'Quitar filtros', 'filter' ) : C.empty( 'Sin secciones este ciclo', 'Este curso no tiene secciones registradas en el ciclo actual.', '#/cursos', 'Ver otros cursos', 'calendar' ) }
	</section>
</div></div>` };
	};

	/* Catálogo de docentes ---------------------------------------------------------- */
	P.docentes = ( r ) => {
		const q = r.params.get( 'q' ) || '';
		const curso = Number( r.params.get( 'curso' ) || 0 );
		const items = JZ.docentes( { q, curso } );
		return { title: 'Docentes — JZING', html: `${ head( [ home, [ 'Docentes' ] ], 'Docentes', 'Cada tarjeta resume la huella de enseñanza en siete dimensiones. No ordenamos de "mejor" a "peor": el orden es alfabético.' ) }
<div class="jz-container jz-page-body"><div class="jz-layout-filters">
	<aside class="jz-filters" aria-labelledby="jz-doc-filters"><form class="jz-filters__form" data-route-form="docentes">
		<h2 class="jz-filters__title" id="jz-doc-filters">${ i( 'filter' ) } Filtros</h2>
		${ C.searchInline( { value: q, type: 'docentes', label: 'Nombre o área del docente', placeholder: 'Ej.: Salinas' } ) }
		<div class="jz-field"><label for="jz-f-curso">Dicta el curso</label><select id="jz-f-curso" name="curso"><option value="0">Cualquier curso</option>${ JZ.courses().map( ( c ) => `<option value="${ c.id }" ${ c.id === curso ? 'selected' : '' }>${ e( c.title ) }</option>` ).join( '' ) }</select></div>
		<div class="jz-filters__actions"><button type="submit" class="jz-btn jz-btn--primary jz-btn--block">Aplicar filtros</button>${ q || curso ? '<a class="jz-btn jz-btn--tertiary jz-btn--block" href="#/docentes">Limpiar</a>' : '' }</div>
	</form></aside>
	<section class="jz-results" aria-labelledby="jz-doc-results">
		<div class="jz-results__head"><h2 class="jz-results__title" id="jz-doc-results">${ JZ.plural( items.length, 'docente', 'docentes' ) }</h2></div>
		${ items.length ? `<div class="jz-grid jz-grid--2">${ items.map( ( d ) => C.docenteCard( d ) ).join( '' ) }</div>` : C.empty( 'No encontramos docentes', q ? `Ningún docente registrado coincide con «${ q }».` : 'No hay docentes con estos filtros.', '#/docentes', 'Ver todos los docentes', 'users' ) }
	</section>
</div></div>` };
	};

	/* Perfil docente ------------------------------------------------------------------ */
	P.docente = ( r ) => {
		const base = JZ.docente( r.path[ 1 ] );
		if ( ! base ) {
			return P.notFound();
		}
		let courseId = Number( r.params.get( 'curso' ) || 0 );
		if ( courseId && ! base.courses.some( ( c ) => c.id === courseId ) ) {
			courseId = 0;
		}
		const d = courseId ? JZ.docente( base.id, courseId ) : base;
		const s = d.stats;
		const has = s.count > 0;
		const path = 'docentes/' + d.slug;
		const courseTitle = courseId ? d.courses.find( ( c ) => c.id === courseId ).title : '';
		const rcurso = Number( r.params.get( 'rcurso' ) || courseId || 0 );
		const rciclo = r.params.get( 'rciclo' ) || '';
		const rorden = r.params.get( 'rorden' ) === 'util' ? 'util' : 'reciente';
		const rpag = Math.max( 1, Number( r.params.get( 'rpag' ) || 1 ) );
		const all = JZ.reviewsFor( d.id, { curso: rcurso, periodo: rciclo, orden: rorden } );
		const pages = Math.max( 1, Math.ceil( all.length / 6 ) );
		const page = all.slice( ( rpag - 1 ) * 6, rpag * 6 );
		const sections = JZ.sectionsFor( { docente: d.id } );
		const rparams = { curso: courseId, rcurso, rciclo, rorden: rorden === 'util' ? 'util' : '' };
		const flags = [];
		if ( s.fechas_anticipadas != null ) {
			const ok = s.fechas_anticipadas >= 50;
			flags.push( `<li class="${ ok ? 'is-ok' : 'is-warn' }">${ i( ok ? 'check' : 'alert' ) }<span>Comunica las fechas de evaluación con anticipación (${ s.fechas_anticipadas } % de reseñas)</span></li>` );
		}
		if ( s.respeta_horario != null ) {
			const ok = s.respeta_horario >= 50;
			flags.push( `<li class="${ ok ? 'is-ok' : 'is-warn' }">${ i( ok ? 'check' : 'alert' ) }<span>${ ok ? `Respeta el horario de clase (${ s.respeta_horario } % de reseñas)` : `Suele no respetar el horario de clase (solo ${ s.respeta_horario } % indica que sí)` }</span></li>` );
		}
		if ( s.evaluaciones && s.evaluaciones.sorpresa > 50 ) {
			flags.push( `<li class="is-warn">${ i( 'alert' ) }<span>Suele tomar controles sorpresa (${ s.evaluaciones.sorpresa } % de reseñas)</span></li>` );
		}
		return { title: `${ d.name } — JZING`, html: `
<div class="jz-page-head jz-page-head--profile"><div class="jz-container">${ C.crumbs( [ home, [ 'Docentes', '#/docentes' ], [ d.name ] ] ) }
	<div class="jz-profile">${ C.avatar( d.initials, 'lg' ) }
		<div class="jz-profile__body"><div class="jz-card__badges">${ has ? C.reliability( d.rel, true ) : '' }${ C.apta( s.apta_trabajo ) }${ C.demoBadge() }</div>
			<h1 class="jz-page-title">${ e( d.name ) }</h1><p class="jz-profile__sub">${ e( [ d.grado, d.area ].filter( Boolean ).join( ' · ' ) ) }</p>
			<dl class="jz-profile__stats"><div><dt>Reseñas</dt><dd class="jz-num">${ s.count }</dd></div><div><dt>Recientes (2 ciclos)</dt><dd class="jz-num">${ s.recent }</dd></div><div><dt>Cursos</dt><dd class="jz-num">${ d.courses.length }</dd></div></dl>
		</div>
		<div class="jz-profile__actions">${ C.compareBtn( 'docentes', d.id, d.name ) }<a class="jz-btn jz-btn--primary" href="${ JZ.hash( 'publicar-resena', { docente: d.id, curso: courseId } ) }">${ i( 'edit' ) }<span>Publicar reseña</span></a></div>
	</div>
	<p class="jz-profile__bio">${ e( d.excerpt ) }</p>
</div></div>
<div class="jz-container jz-page-body">
	${ d.courses.length > 1 ? `<nav class="jz-tabs" aria-label="Ver evaluación por curso"><ul role="list"><li><a href="#/${ e( path ) }" ${ ! courseId ? 'aria-current="page"' : '' }>Todos los cursos</a></li>${ d.courses.map( ( c ) => `<li><a href="${ JZ.hash( path, { curso: c.id } ) }" ${ c.id === courseId ? 'aria-current="page"' : '' }>${ e( c.title ) }</a></li>` ).join( '' ) }</ul></nav>` : '' }
	<div class="jz-profile-grid">
		<div class="jz-profile-grid__main">
			<section class="jz-panel" aria-labelledby="jz-huella-title"><h2 class="jz-panel__title" id="jz-huella-title">Huella de enseñanza</h2>
				<p class="jz-panel__sub">${ courseTitle ? `Promedio de reseñas publicadas en ${ e( courseTitle ) }.` : 'Promedio de reseñas publicadas en todos sus cursos.' } Toca una dimensión para ver qué significa.</p>
				${ has ? `${ C.huella( s ) }<p class="jz-panel__note">${ i( 'info' ) } Escala del 1 al 5. En carga de trabajo, un valor alto indica más carga. Con menos de 3 reseñas mostramos «Datos insuficientes».</p>` : C.empty( 'Aún no hay reseñas publicadas', 'Cuando haya reseñas, verás aquí sus siete dimensiones.', JZ.hash( 'publicar-resena', { docente: d.id } ), 'Sé el primero en reseñar', 'layers' ) }
			</section>
			<section class="jz-panel" id="resenas" aria-labelledby="jz-reviews-title" tabindex="-1">
				<div class="jz-panel__head"><h2 class="jz-panel__title" id="jz-reviews-title">Lo que dicen sus estudiantes</h2><span class="jz-muted">${ JZ.plural( all.length, 'reseña', 'reseñas' ) }</span></div>
				<form class="jz-inline-filters" data-route-form="${ e( path ) }" data-keep="curso">
					<input type="hidden" name="curso" value="${ courseId || '' }">
					<div class="jz-field"><label for="jz-r-curso">Curso</label><select id="jz-r-curso" name="rcurso"><option value="0">Todos</option>${ d.courses.map( ( c ) => `<option value="${ c.id }" ${ c.id === rcurso ? 'selected' : '' }>${ e( c.title ) }</option>` ).join( '' ) }</select></div>
					<div class="jz-field"><label for="jz-r-ciclo">Ciclo</label><select id="jz-r-ciclo" name="rciclo"><option value="">Todos</option>${ JZ.periods.list( 10 ).map( ( p ) => `<option value="${ p }" ${ p === rciclo ? 'selected' : '' }>${ p }</option>` ).join( '' ) }</select></div>
					<div class="jz-field"><label for="jz-r-orden">Ordenar</label><select id="jz-r-orden" name="rorden"><option value="reciente">Más recientes</option><option value="util" ${ rorden === 'util' ? 'selected' : '' }>Más útiles</option></select></div>
					<button type="submit" class="jz-btn jz-btn--secondary jz-btn--sm">Filtrar</button>
				</form>
				${ page.length ? `<div class="jz-reviews" data-reviews>${ page.map( C.reviewItem ).join( '' ) }</div>${ pages > 1 ? `<nav class="jz-pagination" aria-label="Páginas de reseñas"><ul>${ rpag > 1 ? `<li><a href="${ JZ.hash( path, { ...rparams, rpag: rpag - 1 } ) }" data-scroll="resenas">Anteriores</a></li>` : '' }<li><span aria-current="page">Página ${ rpag } de ${ pages }</span></li>${ rpag < pages ? `<li><a href="${ JZ.hash( path, { ...rparams, rpag: rpag + 1 } ) }" data-scroll="resenas">Siguientes</a></li>` : '' }</ul></nav>` : '' }` : C.empty( 'No hay reseñas con estos filtros', 'Prueba con otro curso o ciclo.', '#/' + path, 'Ver todas las reseñas', 'chat' ) }
			</section>
		</div>
		<aside class="jz-profile-grid__side" aria-label="Detalles de la clase">
			${ has ? `<section class="jz-panel jz-panel--compact" aria-labelledby="jz-style-title"><h2 class="jz-panel__title" id="jz-style-title">Estilo de clase</h2>${ C.splitBar( s.teoria_pct ) }${ s.herramientas_vivo >= 50 ? `<p>${ C.badge( 'Usa herramientas en vivo', 'info', 'check' ) }</p>` : '' }</section>
			<section class="jz-panel jz-panel--compact" aria-labelledby="jz-eval-title"><h2 class="jz-panel__title" id="jz-eval-title">Cómo evalúa</h2>
				${ s.evaluaciones ? `<ul class="jz-facts" role="list">${ Object.entries( s.evaluaciones ).filter( ( [ k, v ] ) => v > 0 && k !== 'sorpresa' ).map( ( [ k, v ] ) => `<li><span>${ JZ.EVAL_LABELS[ k ] }</span><strong class="jz-num">${ v } %</strong></li>` ).join( '' ) }</ul><p class="jz-panel__note">% de reseñas que mencionan cada tipo de evaluación.</p>` : '' }
				${ s.trabajo ? `<h3 class="jz-panel__subtitle">Trabajos</h3><ul class="jz-facts" role="list">${ Object.entries( s.trabajo ).map( ( [ k, v ] ) => `<li><span>${ JZ.WORK_LABELS[ k ] }</span><strong class="jz-num">${ v } %</strong></li>` ).join( '' ) }</ul>` : '' }
				<ul class="jz-flags" role="list">${ flags.join( '' ) }</ul>
				<p class="jz-panel__note">Basado en ${ JZ.plural( s.count, 'reseña', 'reseñas' ) }.</p>
			</section>` : '' }
			<section class="jz-panel jz-panel--compact" aria-labelledby="jz-sec-title"><h2 class="jz-panel__title" id="jz-sec-title">Secciones ${ e( JZ.PERIOD ) }</h2>
				${ sections.length ? `<ul class="jz-section-list" role="list">${ sections.map( ( x ) => `<li><div><a href="#/cursos/${ e( x.courseObj.slug ) }"><strong>${ e( x.courseObj.title ) }</strong></a> <span class="jz-chip jz-chip--accent">${ e( x.code ) }</span><p class="jz-muted">${ e( x.schedule ) }</p></div>${ C.compareBtn( 'secciones', x.id, `${ x.code } · ${ d.name }`, x.course, x.courseObj.title ) }</li>` ).join( '' ) }</ul>` : '<p class="jz-muted">Sin secciones registradas en el ciclo actual.</p>' }
			</section>
		</aside>
	</div>
</div>` };
	};

	/* Comparador -------------------------------------------------------------------------- */
	P.comparar = ( r ) => {
		const type = r.params.get( 'tipo' ) === 'docentes' ? 'docentes' : 'secciones';
		const ids = ( r.params.get( 'ids' ) || '' ).split( ',' ).map( Number ).filter( Boolean );
		const data = JZ.compare( type, ids );
		const cols = data.items.map( ( it ) => ( type === 'secciones'
			? { id: it.id, title: it.docenteObj.name, kicker: `Sección ${ it.code }`, url: `#/docentes/${ it.docenteObj.slug }?curso=${ it.course }`, schedule: it.schedule, stats: it.stats, rel: it.rel }
			: { id: it.id, title: it.name, kicker: it.courses.map( ( c ) => c.title ).join( ', ' ), url: `#/docentes/${ it.slug }`, schedule: '', stats: it.stats, rel: it.rel } ) );
		const n = cols.length;
		const best = {};
		const diffs = {};
		let biggest = { key: '', gap: 0 };
		JZ.DIMS.forEach( ( d ) => {
			const vals = {};
			cols.forEach( ( c, x ) => {
				if ( c.stats.dims[ d.key ].avg != null ) {
					vals[ x ] = c.stats.dims[ d.key ].avg;
				}
			} );
			const arr = Object.values( vals );
			diffs[ d.key ] = false;
			if ( arr.length >= 2 ) {
				const gap = Math.max( ...arr ) - Math.min( ...arr );
				diffs[ d.key ] = gap >= 0.5;
				const target = JZ.higherIsBetter( d.key ) ? Math.max( ...arr ) : Math.min( ...arr );
				if ( gap > 0 ) {
					best[ d.key ] = Object.keys( vals ).filter( ( k ) => vals[ k ] === target ).map( Number );
				}
				if ( gap > biggest.gap ) {
					biggest = { key: d.key, gap };
				}
			}
		} );
		const idsStr = cols.map( ( c ) => c.id ).join( ',' );
		const share = location.href.split( '#' )[ 0 ] + JZ.hash( 'comparar', { tipo: type, ids: idsStr } );
		const first = data.items[ 0 ];
		const lead = type === 'secciones' && first ? `${ e( first.courseObj.title ) } · Ciclo ${ e( first.period ) }` : n ? 'Huella global de cada docente (todos sus cursos).' : '';
		const dimLabel = Object.fromEntries( JZ.DIMS.map( ( d ) => [ d.key, d.label ] ) );
		const row = ( label, cells, diff = 1 ) => `<tr data-diff="${ diff }"><th scope="row" class="jz-compare__attr">${ label }</th>${ cells }</tr>`;
		const shareHtml = n >= 2 ? `<div class="jz-share" data-share data-share-url="${ e( share ) }"><button type="button" class="jz-btn jz-btn--secondary jz-btn--sm" data-share-copy>${ i( 'copy' ) }<span>Copiar enlace</span></button><a class="jz-btn jz-btn--secondary jz-btn--sm" href="https://wa.me/?text=${ encodeURIComponent( 'Mira esta comparación en JZING: ' + share ) }" target="_blank" rel="noopener noreferrer">${ i( 'whatsapp' ) }<span>Enviar por WhatsApp</span><span class="screen-reader-text"> (se abre en una pestaña nueva)</span></a></div>` : '';
		return { title: 'Comparar — JZING', html: `
<div class="jz-page-head"><div class="jz-container">${ C.crumbs( [ home, [ 'Comparar' ] ] ) }<div class="jz-page-head__row"><div><h1 class="jz-page-title">${ type === 'docentes' ? 'Compara docentes' : 'Compara secciones' }</h1>${ lead ? `<p class="jz-lead">${ lead }</p>` : '' }</div>${ shareHtml }</div></div></div>
<div class="jz-container jz-page-body" data-compare-page data-type="${ type }" data-ids="${ idsStr }" data-course-id="${ type === 'secciones' && first ? first.course : 0 }" data-course-name="${ type === 'secciones' && first ? e( first.courseObj.title ) : '' }">
${ data.error ? `<p class="jz-alert jz-alert--warning" role="alert">${ i( 'alert' ) }<span>${ e( data.error ) }</span></p>` : '' }
${ ! n ? `<div data-compare-empty>${ C.empty( 'Tu comparador está vacío', 'Abre un curso y pulsa «Comparar» en dos o tres secciones del mismo curso. También puedes comparar docentes desde su tarjeta.', '#/cursos', 'Explorar cursos', 'columns' ) }<p class="jz-compare-resume" data-compare-resume hidden></p></div>` : `
	${ n === 1 ? `<p class="jz-alert jz-alert--info" role="status">${ i( 'info' ) }<span>Agrega al menos otra opción para comparar.</span></p>` : '' }
	${ biggest.key && n >= 2 ? `<p class="jz-compare-summary">${ i( 'star' ) }<span>La mayor diferencia está en ${ e( dimLabel[ biggest.key ] ) }: ${ JZ.num( biggest.gap ) } puntos entre la opción más alta y la más baja.</span></p>` : '' }
	<div class="jz-compare-tools"><label class="jz-switch" for="jz-only-diff"><input type="checkbox" id="jz-only-diff" role="switch" data-only-diff aria-controls="jz-compare-table"><span class="jz-switch__track" aria-hidden="true"></span><span>Mostrar solo diferencias</span></label><p class="jz-muted">${ i( 'star', 'jz-icon--best' ) } Resaltado = valor más alto de la fila (en carga de trabajo, la menor carga).</p></div>
	<div class="jz-compare-scroll" tabindex="0" role="region" aria-labelledby="jz-compare-caption"><table class="jz-compare" id="jz-compare-table" style="--cols:${ n }">
		<caption id="jz-compare-caption" class="screen-reader-text">Comparación lado a lado. Cada fila compara el mismo atributo.</caption>
		<thead><tr><th scope="col" class="jz-compare__attr">Criterio</th>${ cols.map( ( c ) => `<th scope="col"><span class="jz-chip jz-chip--accent">${ e( c.kicker ) }</span><a class="jz-compare__name" href="${ e( c.url ) }">${ e( c.title ) }</a><a class="jz-compare__remove" href="${ JZ.hash( 'comparar', { tipo: type, ids: cols.filter( ( x ) => x.id !== c.id ).map( ( x ) => x.id ).join( ',' ) } ) }" data-compare-remove="${ c.id }">${ i( 'close' ) }<span>Quitar</span><span class="screen-reader-text"> ${ e( c.title ) }</span></a></th>` ).join( '' ) }</tr></thead>
		<tbody>
		${ type === 'secciones' ? row( 'Horario', cols.map( ( c ) => `<td>${ e( c.schedule ) }</td>` ).join( '' ) ) : '' }
		${ row( 'Confiabilidad', cols.map( ( c ) => `<td>${ c.stats.count ? C.reliability( c.rel ) : C.badge( 'Sin reseñas', 'neutral' ) }<small class="jz-muted jz-block">${ JZ.plural( c.stats.count, 'reseña', 'reseñas' ) }</small></td>` ).join( '' ) ) }
		${ row( 'Apta para quienes trabajan', cols.map( ( c ) => `<td>${ c.stats.apta_trabajo ? i( 'check' ) + ' Sí' : 'No / sin datos' }</td>` ).join( '' ) ) }
		${ JZ.DIMS.map( ( d ) => row( e( d.label ), cols.map( ( c, x ) => {
			const cell = c.stats.dims[ d.key ];
			const isBest = best[ d.key ] && best[ d.key ].includes( x );
			return `<td class="${ isBest ? 'is-best' : '' }">${ cell.enough ? `<span class="jz-compare__value"><strong class="jz-num">${ JZ.num( cell.avg ) }</strong><span class="screen-reader-text"> de 5</span>${ isBest ? `<span class="jz-best">${ i( 'star' ) }${ d.key === 'carga' ? 'Menor carga' : 'Mayor valor' }</span>` : '' }</span><span class="jz-minibar" aria-hidden="true"><span style="width:${ Math.round( ( cell.avg / 5 ) * 100 ) }%"></span></span>` : '<span class="jz-muted">Datos insuficientes</span>' }</td>`;
		} ).join( '' ), diffs[ d.key ] ? 1 : 0 ) ).join( '' ) }
		${ row( 'Teoría / práctica', cols.map( ( c ) => `<td>${ c.stats.teoria_pct != null ? `${ c.stats.teoria_pct } % / ${ c.stats.practica_pct } %` : 'Sin datos' }</td>` ).join( '' ) ) }
		${ row( 'Respeta el horario', cols.map( ( c ) => `<td>${ c.stats.respeta_horario != null ? c.stats.respeta_horario + ' %' : 'Sin datos' }</td>` ).join( '' ) ) }
		</tbody></table></div>
	<p class="jz-muted jz-compare-note">El enlace compartido muestra la comparación en modo lectura y no contiene datos personales.</p>
	<div class="jz-compare-actions">${ type === 'secciones' && first ? `<a class="jz-btn jz-btn--secondary" href="#/cursos/${ e( first.courseObj.slug ) }">Volver al curso</a>` : '' }<a class="jz-btn jz-btn--tertiary" href="#/cursos">Explorar otros cursos</a></div>` }
</div>` };
	};

	/* Resultados de búsqueda ----------------------------------------------------------------- */
	P.buscar = ( r ) => {
		const q = r.params.get( 'q' ) || '';
		const res = q.trim() ? JZ.search( q, 'todo', 12 ) : null;
		const tips = [ 'profesores de Matemática', 'Base de Datos', 'cursos que dicta Salinas', 'JZ-AE201' ];
		let body;
		if ( ! res ) {
			body = `<div class="jz-search-tips"><h2 class="jz-subtitle">Ideas para buscar</h2><ul class="jz-chips" role="list">${ tips.map( ( t ) => `<li><a class="jz-chip jz-chip--button" href="${ JZ.hash( 'buscar', { q: t } ) }">${ e( t ) }</a></li>` ).join( '' ) }</ul></div>`;
		} else {
			body = `${ res.label ? `<p class="jz-interpretation">${ i( 'info' ) } <span>Interpretamos tu búsqueda como: ${ e( res.label ) }</span></p>` : '' }
			${ ! res.total ? C.empty( 'Sin resultados', res.message, '#/cursos', 'Ver todos los cursos' ) : '' }
			${ res.cursos.length ? `<section class="jz-section--tight" aria-labelledby="jz-res-cursos"><h2 class="jz-subtitle" id="jz-res-cursos">${ JZ.plural( res.cursos.length, 'curso', 'cursos' ) }</h2><div class="jz-grid jz-grid--3">${ res.cursos.map( ( c ) => C.courseCard( c ) ).join( '' ) }</div></section>` : '' }
			${ res.docentes.length ? `<section class="jz-section--tight" aria-labelledby="jz-res-docentes"><h2 class="jz-subtitle" id="jz-res-docentes">${ JZ.plural( res.docentes.length, 'docente', 'docentes' ) }</h2><div class="jz-grid jz-grid--3">${ res.docentes.map( ( d ) => C.docenteCard( d ) ).join( '' ) }</div></section>` : '' }`;
		}
		return { title: 'Buscar — JZING', html: `${ head( [ home, [ 'Buscar' ] ], q ? `Resultados para «${ e( q ) }»` : 'Buscar cursos y docentes', '', false, C.searchForm( { id: 'jz-page-search', value: q, size: 'lg', label: 'Escribe o dicta tu búsqueda' } ) ) }<div class="jz-container jz-page-body">${ body }</div>` };
	};

	/* Publicar / editar reseña (SIMULADO) ------------------------------------------------------- */
	P.publicar = ( r ) => {
		const user = JZ.user();
		const editId = r.params.get( 'editar' ) || '';
		const editing = editId ? JZ.store.get().reviews.find( ( x ) => x.id === editId ) : null;
		const title = editing ? 'Editar tu reseña' : 'Publica una reseña';
		const top = head( [ home, [ editing ? 'Editar reseña' : 'Publicar reseña' ] ], title, 'Valora siete dimensiones y cuenta brevemente tu experiencia. Te tomará menos de tres minutos.', true );
		const simNote = `<p class="jz-alert jz-alert--sim">${ i( 'monitor' ) }<span><strong>Demostración:</strong> la reseña se guarda solo en este navegador (localStorage). En el proyecto real se envía a WordPress, se guarda en MySQL y la revisa un moderador.</span></p>`;
		if ( ! user ) {
			return { title: 'Publicar reseña — JZING', html: `${ top }<div class="jz-container jz-container--narrow jz-page-body">${ simNote }<div class="jz-panel jz-panel--center">${ i( 'user', 'jz-icon--xl' ) }<h2 class="jz-panel__title">Inicia sesión para reseñar</h2><p>Pedimos una cuenta para evitar reseñas duplicadas y poder moderar. Tu nombre no se mostrará públicamente.</p><p class="jz-actions-row"><a class="jz-btn jz-btn--primary" href="${ JZ.hash( 'ingresar', { volver: location.hash.slice( 2 ) } ) }">Iniciar sesión</a><a class="jz-btn jz-btn--secondary" href="${ JZ.hash( 'ingresar', { volver: location.hash.slice( 2 ) } ) }">Crear cuenta</a></p></div></div>` };
		}
		if ( editId && ( ! editing || ! JZ.canEdit( editing ) ) ) {
			return { title: 'Editar reseña — JZING', html: `${ top }<div class="jz-container jz-container--narrow jz-page-body"><p class="jz-alert jz-alert--warning" role="alert">${ i( 'alert' ) }<span>No puedes editar esta reseña: no es tuya o venció el plazo (hasta el final del ciclo siguiente).</span></p></div>` };
		}
		const v = editing || {};
		const preDoc = editing ? v.docente : Number( r.params.get( 'docente' ) || 0 );
		const preCur = editing ? v.course : Number( r.params.get( 'curso' ) || 0 );
		let preTarget = preDoc && preCur ? preDoc + ':' + preCur : '';
		const targets = JZ.reviewTargets();
		if ( preDoc && ! preCur ) {
			const t = targets.find( ( x ) => x.docente === preDoc );
			preTarget = t ? t.docente + ':' + t.course : '';
		}
		const req = '<span class="jz-req">(obligatorio)</span>';
		const yesNo = ( name, q, val ) => `<fieldset class="jz-fieldset jz-fieldset--inline" aria-describedby="jz-err-${ name }"><legend>${ q } ${ req }</legend><label class="jz-radio"><input type="radio" name="${ name }" value="1" required ${ val === 1 ? 'checked' : '' }> <span>Sí</span></label><label class="jz-radio"><input type="radio" name="${ name }" value="0" ${ val === 0 ? 'checked' : '' }> <span>No</span></label><p class="jz-field-error" id="jz-err-${ name }" data-error-for="${ name }" hidden></p></fieldset>`;
		return { title: 'Publicar reseña — JZING', html: `${ top }
<div class="jz-container jz-container--narrow jz-page-body">${ simNote }
<div class="jz-alert jz-alert--error" role="alert" tabindex="-1" data-form-summary hidden>${ i( 'alert' ) }<div><p><strong>Revisa estos campos:</strong></p><ul data-form-summary-list></ul></div></div>
<form class="jz-form jz-review-form" novalidate data-review-form data-edit-id="${ e( editId ) }">
	<p class="jz-form__legend-note">Los campos marcados como (obligatorio) son necesarios.</p>
	<fieldset class="jz-step-block"><legend><span class="jz-step-block__num" aria-hidden="true">1</span>Paso 1 de 2: curso y docente</legend>
		<div class="jz-field"><label for="jz-target">Curso y docente ${ req }</label><select id="jz-target" name="target" required aria-describedby="jz-target-help jz-err-curso_id" ${ editing ? 'disabled' : '' }><option value="">— Selecciona —</option>${ targets.map( ( t ) => `<option value="${ t.docente }:${ t.course }" ${ preTarget === t.docente + ':' + t.course ? 'selected' : '' }>${ e( t.label ) }</option>` ).join( '' ) }</select><p class="jz-help" id="jz-target-help">Solo aparecen docentes con secciones registradas en cada curso.</p><p class="jz-field-error" id="jz-err-curso_id" data-error-for="curso_id" hidden></p></div>
		<div class="jz-field"><label for="jz-periodo">Ciclo en que llevaste el curso ${ req }</label><select id="jz-periodo" name="periodo" required aria-describedby="jz-err-periodo" ${ editing ? 'disabled' : '' }><option value="">— Selecciona —</option>${ JZ.periods.list( 10 ).map( ( p ) => `<option value="${ p }" ${ v.period === p ? 'selected' : '' }>${ p }</option>` ).join( '' ) }</select><p class="jz-field-error" id="jz-err-periodo" data-error-for="periodo" hidden></p></div>
	</fieldset>
	<fieldset class="jz-step-block"><legend><span class="jz-step-block__num" aria-hidden="true">2</span>Paso 2 de 2: tu experiencia</legend>
		<h2 class="jz-form__subtitle">Huella de enseñanza</h2><p class="jz-help">Del 1 al 5. Usa las flechas del teclado para cambiar el valor.</p>
		${ JZ.DIMS.map( ( d ) => `<fieldset class="jz-rating" aria-describedby="jz-dimdesc-${ d.key } jz-err-dim_${ d.key }"><legend class="jz-rating__legend">${ e( d.label ) } ${ req }</legend><p class="jz-help" id="jz-dimdesc-${ d.key }">${ e( d.description ) }</p><div class="jz-rating__scale"><span class="jz-rating__end" aria-hidden="true">${ e( d.low ) }</span>${ [ 1, 2, 3, 4, 5 ].map( ( n ) => `<label class="jz-rating__opt"><input type="radio" name="dim_${ d.key }" value="${ n }" ${ v.dims && v.dims[ d.key ] === n ? 'checked' : '' } required><span class="jz-num">${ n }</span>${ n === 1 ? `<span class="screen-reader-text">${ e( d.low ) }</span>` : n === 5 ? `<span class="screen-reader-text">${ e( d.high ) }</span>` : '' }</label>` ).join( '' ) }<span class="jz-rating__end" aria-hidden="true">${ e( d.high ) }</span></div><p class="jz-field-error" id="jz-err-dim_${ d.key }" data-error-for="dim_${ d.key }" hidden></p></fieldset>` ).join( '' ) }
		<h2 class="jz-form__subtitle">Organización de la clase</h2>
		${ yesNo( 'respeta_horario', '¿El docente respetaba el horario de clase?', v.respeta ) }
		${ yesNo( 'fechas_anticipadas', '¿Comunicaba las fechas de evaluación con anticipación?', v.fechas ) }
		<fieldset class="jz-fieldset"><legend>Tipos de evaluación (marca todos los que hubo)</legend><div class="jz-checks">${ Object.entries( JZ.EVAL_LABELS ).map( ( [ k, l ] ) => `<label class="jz-check"><input type="checkbox" name="evaluaciones" value="${ k }" ${ v.evals && v.evals.includes( k ) ? 'checked' : '' }> <span>${ l }</span></label>` ).join( '' ) }</div></fieldset>
		<fieldset class="jz-fieldset jz-fieldset--inline" aria-describedby="jz-err-modalidad_trabajo"><legend>Los trabajos eran… ${ req }</legend>${ Object.entries( JZ.WORK_LABELS ).map( ( [ k, l ] ) => `<label class="jz-radio"><input type="radio" name="modalidad_trabajo" value="${ k }" required ${ v.trabajo === k ? 'checked' : '' }> <span>${ l }</span></label>` ).join( '' ) }<p class="jz-field-error" id="jz-err-modalidad_trabajo" data-error-for="modalidad_trabajo" hidden></p></fieldset>
		<div class="jz-field"><label for="jz-teoria">Proporción aproximada de teoría ${ req }</label><div class="jz-range jz-range--wide"><input type="range" id="jz-teoria" name="teoria_pct" min="0" max="100" step="10" value="${ v.teoria != null ? v.teoria : 50 }" aria-describedby="jz-teoria-out" data-teoria-range><output id="jz-teoria-out" for="jz-teoria" class="jz-range__out" data-teoria-out></output></div></div>
		<label class="jz-check"><input type="checkbox" name="herramientas_vivo" value="1" ${ v.vivo ? 'checked' : '' }> <span>Usaba herramientas en vivo (por ejemplo, programación o simulaciones en clase)</span></label>
		<div class="jz-field"><label for="jz-comentario">Comentario <span class="jz-req">(obligatorio, de 30 a 500 caracteres)</span></label><textarea id="jz-comentario" name="comentario" rows="5" minlength="30" maxlength="500" required aria-describedby="jz-comentario-help jz-comentario-count jz-err-comentario" data-comment>${ e( v.comment || '' ) }</textarea><p class="jz-help" id="jz-comentario-help">Describe cómo enseña y evalúa. Evita insultos y datos personales (enlaces, correos o teléfonos no están permitidos).</p><p class="jz-counter" id="jz-comentario-count" data-comment-count aria-live="polite"></p><p class="jz-field-error" id="jz-err-comentario" data-error-for="comentario" hidden></p></div>
		<h2 class="jz-form__subtitle">Datos visibles (opcionales)</h2>
		<div class="jz-form__row"><div class="jz-field"><label for="jz-autor-carrera">Tu carrera</label><select id="jz-autor-carrera" name="autor_carrera" data-preview-carrera><option value="">Prefiero no indicarla</option>${ JZ.careers().map( ( c ) => `<option value="${ e( c.name ) }" ${ v.carrera === c.name ? 'selected' : '' }>${ e( c.name ) }</option>` ).join( '' ) }</select></div>
		<div class="jz-field"><label for="jz-autor-ciclo">Tu ciclo actual</label><select id="jz-autor-ciclo" name="autor_ciclo" data-preview-ciclo><option value="0">Prefiero no indicarlo</option>${ Array.from( { length: 12 }, ( _, n ) => `<option value="${ n + 1 }" ${ v.ciclo === n + 1 ? 'selected' : '' }>${ n + 1 }</option>` ).join( '' ) }</select></div></div>
		<div class="jz-privacy-preview" aria-live="polite">${ i( 'shield' ) }<p><strong>Esto verán los demás:</strong> <span data-preview-text>Estudiante (datos no indicados)</span>. Tu nombre y tu correo nunca se muestran; solo el equipo de moderación puede ver tu identidad si la reseña es reportada.</p></div>
	</fieldset>
	<p class="jz-help">Tu reseña pasará por moderación antes de publicarse. Una reseña por curso y ciclo.</p>
	<div class="jz-form__actions"><button type="submit" class="jz-btn jz-btn--primary jz-btn--lg" data-submit>${ editing ? 'Guardar cambios' : 'Publicar reseña' }</button><a class="jz-btn jz-btn--tertiary" href="#/">Cancelar</a></div>
</form></div>` };
	};

	/* Mis reseñas (SIMULADO) ----------------------------------------------------------------------- */
	P.misResenas = ( r ) => {
		const user = JZ.user();
		const top = head( [ home, [ 'Mis reseñas' ] ], 'Mis reseñas', '', true );
		const msgs = { enviada: [ 'success', 'Recibimos tu reseña. Se publicará cuando el equipo de moderación la revise. En esta demo puedes aprobarla entrando como moderador.' ], editada: [ 'success', 'Guardamos los cambios de tu reseña. Vuelve a revisión de moderación.' ] };
		const m = msgs[ r.params.get( 'estado' ) ];
		const alert = m ? `<p class="jz-alert jz-alert--${ m[ 0 ] }" role="status">${ i( 'check' ) }<span>${ m[ 1 ] }</span></p>` : '';
		if ( ! user ) {
			return { title: 'Mis reseñas — JZING', html: `${ top }<div class="jz-container jz-container--narrow jz-page-body"><div class="jz-panel jz-panel--center"><h2 class="jz-panel__title">Inicia sesión para ver tus reseñas</h2><p><a class="jz-btn jz-btn--primary" href="${ JZ.hash( 'ingresar', { volver: 'mis-resenas' } ) }">Iniciar sesión</a></p></div></div>` };
		}
		const mine = JZ.allReviews().filter( ( x ) => x.author === user.id );
		const impact = mine.reduce( ( a, x ) => a + x.util, 0 );
		const st = { publish: [ 'success', 'Publicada', 'check' ], pending: [ 'warning', 'En revisión', 'clock' ], oculta: [ 'error', 'Oculta por moderación', 'alert' ] };
		const list = mine.length ? `<div class="jz-impact">${ i( 'thumb' ) }<p>${ impact ? `Tus reseñas fueron útiles para ${ JZ.plural( impact, 'estudiante', 'estudiantes' ) }.` : 'Aún nadie marcó tus reseñas como útiles. ¡Gracias por aportar!' }</p></div>
			<p class="jz-actions-row"><a class="jz-btn jz-btn--primary" href="#/publicar-resena">${ i( 'plus' ) }<span>Nueva reseña</span></a></p>
			<ul class="jz-my-reviews" role="list">${ mine.map( ( x ) => {
		const s = st[ x.status ] || st.pending;
		const c = JZ.courseSummary( x.course );
		const d = JZ.docenteSummary( x.docente );
		return `<li class="jz-panel jz-my-review" data-review-id="${ e( x.id ) }"><div class="jz-my-review__head"><div><h2 class="jz-my-review__title">${ e( c.title ) } — ${ e( d.name ) }</h2><p class="jz-muted">Ciclo ${ e( x.period ) }</p></div>${ C.badge( s[ 1 ], s[ 0 ], s[ 2 ] ) }</div>
				<p>${ e( x.comment ) }</p><p class="jz-my-review__meta"><span>${ i( 'thumb' ) } ${ JZ.plural( x.util, 'marca «Útil»', 'marcas «Útil»' ) }</span>${ x.editada ? '<span>Editada</span>' : '' }</p>
				<div class="jz-my-review__actions">${ JZ.canEdit( x ) ? `<a class="jz-btn jz-btn--secondary jz-btn--sm" href="${ JZ.hash( 'publicar-resena', { editar: x.id } ) }">${ i( 'edit' ) }<span>Editar</span></a>` : '<span class="jz-muted">Plazo de edición vencido</span>' }<button type="button" class="jz-btn jz-btn--danger jz-btn--sm" data-review-delete="${ e( x.id ) }">${ i( 'trash' ) }<span>Eliminar</span></button></div></li>`;
	} ).join( '' ) }</ul>` : C.empty( 'Todavía no publicaste reseñas', 'Comparte cómo fue tu experiencia en un curso que llevaste. Ayudarás a otros estudiantes a elegir mejor.', '#/publicar-resena', 'Publicar mi primera reseña', 'chat' );
		return { title: 'Mis reseñas — JZING', html: `${ top }<div class="jz-container jz-container--narrow jz-page-body">${ alert }<p class="jz-alert jz-alert--sim">${ i( 'monitor' ) }<span>Tus reseñas de esta demo están guardadas solo en este navegador.</span></p>${ list }</div>` };
	};

	/* Inicio de sesión (SIMULADO) ------------------------------------------------------------------- */
	P.ingresar = ( r ) => {
		const volver = r.params.get( 'volver' ) || '';
		const user = JZ.user();
		return { title: 'Iniciar sesión — JZING', html: `${ head( [ home, [ 'Iniciar sesión' ] ], 'Iniciar sesión', 'Elige una cuenta de demostración para probar las funciones de estudiante y de moderación.', true ) }
<div class="jz-container jz-container--narrow jz-page-body">
	<p class="jz-alert jz-alert--sim">${ i( 'monitor' ) }<span><strong>Inicio de sesión simulado.</strong> No hay cuentas reales ni contraseñas: la sesión se guarda en este navegador. En el proyecto real se usa el inicio de sesión y registro de WordPress.</span></p>
	${ user ? `<p class="jz-alert jz-alert--info" role="status">${ i( 'user' ) }<span>Ahora estás como <strong>${ e( user.name ) }</strong>.</span></p>` : '' }
	<div class="jz-grid jz-grid--2">
		<div class="jz-card"><div class="jz-card__head">${ C.avatar( 'ED' ) }<div><h2 class="jz-card__title">Estudiante demo</h2><p class="jz-card__sub">Publicar, editar y eliminar reseñas, marcar útiles y reportar.</p></div></div><div class="jz-card__actions"><button type="button" class="jz-btn jz-btn--primary" data-login="estudiante" data-volver="${ e( volver ) }">Entrar como estudiante</button></div></div>
		<div class="jz-card"><div class="jz-card__head">${ C.avatar( 'MD' ) }<div><h2 class="jz-card__title">Moderador demo</h2><p class="jz-card__sub">Revisar reseñas pendientes y reportadas, aprobar u ocultar.</p></div></div><div class="jz-card__actions"><button type="button" class="jz-btn jz-btn--primary" data-login="moderador" data-volver="${ e( volver || 'moderacion' ) }">Entrar como moderador</button></div></div>
	</div>
	${ user ? '<p class="jz-actions-row" style="margin-top:1.5rem"><button type="button" class="jz-btn jz-btn--secondary" data-logout>Cerrar sesión</button></p>' : '' }
</div>` };
	};

	/* Moderación (SIMULADO) ------------------------------------------------------------------------- */
	P.moderacion = ( r ) => {
		const top = head( [ home, [ 'Moderación' ] ], 'Moderación de reseñas', 'Revisa que las reseñas respeten las normas: sin insultos, sin datos personales y relacionadas con la enseñanza.' );
		if ( ! JZ.isMod() ) {
			return { title: 'Moderación — JZING', html: `${ top }<div class="jz-container jz-page-body"><p class="jz-alert jz-alert--warning" role="alert">${ i( 'alert' ) }<span>Esta sección es solo para el equipo de moderación.</span></p><p><a class="jz-btn jz-btn--primary" href="${ JZ.hash( 'ingresar', { volver: 'moderacion' } ) }">Entrar como moderador demo</a></p></div>` };
		}
		const vista = [ 'pendientes', 'reportadas', 'ocultas' ].includes( r.params.get( 'vista' ) ) ? r.params.get( 'vista' ) : 'pendientes';
		const all = JZ.allReviews();
		const st = JZ.store.get();
		const lists = {
			pendientes: all.filter( ( x ) => x.status === 'pending' ),
			reportadas: all.filter( ( x ) => st.reports[ x.id ] && x.status === 'publish' ),
			ocultas: all.filter( ( x ) => x.status === 'oculta' ),
		};
		const labels = { pendientes: 'Pendientes de revisión', reportadas: 'Reportadas', ocultas: 'Ocultas' };
		const items = lists[ vista ];
		const rows = items.map( ( x ) => {
			const c = JZ.courseSummary( x.course );
			const d = JZ.docenteSummary( x.docente );
			const rep = st.reports[ x.id ];
			const actions = [];
			if ( x.status !== 'publish' ) {
				actions.push( `<button type="button" class="jz-btn jz-btn--primary jz-btn--sm" data-moderate="approve" data-id="${ e( x.id ) }">Aprobar y publicar</button>` );
			}
			if ( rep ) {
				actions.push( `<button type="button" class="jz-btn jz-btn--secondary jz-btn--sm" data-moderate="keep" data-id="${ e( x.id ) }">Mantener y cerrar reportes</button>` );
			}
			if ( x.status !== 'oculta' ) {
				actions.push( `<button type="button" class="jz-btn jz-btn--danger jz-btn--sm" data-moderate="hide" data-id="${ e( x.id ) }">Ocultar</button>` );
			}
			return `<li class="jz-panel jz-my-review"><div class="jz-my-review__head"><div><h2 class="jz-my-review__title">${ e( d.name ) } · ${ e( c.title ) } · ${ e( x.period ) }</h2><p class="jz-muted">Autor (visible solo para moderación): ${ x.author ? e( JZ.USERS[ x.author ].name ) : 'Cuenta demo ficticia' }</p></div>${ rep ? C.badge( JZ.plural( rep.count, 'reporte', 'reportes' ), 'warning', 'flag' ) : '' }</div>
				<p>${ e( x.comment ) }</p><p class="jz-muted">${ JZ.DIMS.map( ( dd ) => `${ dd.short } ${ x.dims[ dd.key ] }` ).join( ' · ' ) }</p>
				${ rep ? `<p class="jz-muted">Motivos: ${ e( rep.reasons.map( ( k ) => JZ.REPORT_REASONS[ k ] ).join( '; ' ) ) }</p>` : '' }
				<div class="jz-my-review__actions">${ actions.join( '' ) }</div></li>`;
		} ).join( '' );
		return { title: 'Moderación — JZING', html: `${ top }<div class="jz-container jz-page-body">
			<p class="jz-alert jz-alert--sim">${ i( 'monitor' ) }<span><strong>Panel simulado.</strong> En el proyecto real es una página del panel de WordPress (rol «Moderador JZING»).</span></p>
			<nav class="jz-tabs" aria-label="Vistas de moderación"><ul role="list">${ Object.keys( labels ).map( ( k ) => `<li><a href="${ JZ.hash( 'moderacion', { vista: k } ) }" ${ k === vista ? 'aria-current="page"' : '' }>${ labels[ k ] } (${ lists[ k ].length })</a></li>` ).join( '' ) }</ul></nav>
			${ items.length ? `<ul class="jz-my-reviews" role="list">${ rows }</ul>` : C.empty( 'No hay reseñas en esta vista', vista === 'pendientes' ? 'Entra como estudiante demo, publica una reseña y vuelve aquí para aprobarla.' : 'Nada que revisar por ahora.', '', '', 'shield' ) }
		</div>` };
	};

	/* Accesibilidad ----------------------------------------------------------------------------------- */
	P.accesibilidad = () => ( { title: 'Accesibilidad — JZING', html: `${ head( [ home, [ 'Accesibilidad' ] ], 'Accesibilidad', '', true ) }
<div class="jz-container jz-container--narrow jz-page-body"><article class="jz-prose">
	<p>JZING busca cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA. Esta declaración describe lo que ya ofrecemos y cómo reportar problemas.</p>
	<p><button type="button" class="jz-btn jz-btn--primary" data-a11y-open aria-controls="jz-a11y-panel" aria-expanded="false">${ i( 'a11y' ) }<span>Abrir el panel de accesibilidad</span></button></p>
	<h2>Opciones disponibles</h2>
	<ul><li>Panel de accesibilidad: alto contraste, modo oscuro, fondos de lectura (crema, azul suave, gris), tamaño de texto, espaciado entre letras, interlineado, tipografías alternativas, subrayado de enlaces y reducción de animaciones.</li><li>Navegación completa con teclado, enlace para saltar al contenido e indicadores de foco visibles.</li><li>La huella de enseñanza siempre muestra el valor numérico y el texto; la información nunca depende solo del color.</li><li>Búsqueda por voz opcional, con alternativa completa por teclado.</li></ul>
	<h2>Sobre la lectura amigable para dislexia</h2>
	<p>No existe una combinación de colores o una tipografía que funcione igual para todas las personas con dislexia, y ninguna opción de este panel es un tratamiento. Por eso ofrecemos ajustes que puedes combinar según te resulte más cómodo leer.</p>
	<h2>Privacidad de tus preferencias</h2>
	<p>Tus ajustes se guardan solo en tu navegador (localStorage). No se envían al servidor ni se asocian a tu cuenta, y no registramos información sobre discapacidades.</p>
</article></div>` } );

	/* Sobre esta demostración ------------------------------------------------------------------------- */
	P.demo = () => {
		const real = [ 'Diseño completo: colores, tipografía, tarjetas, botones, formularios y responsive (mismos archivos CSS que el tema)', 'Navegación entre todas las páginas', 'Búsqueda escrita con sugerencias e interpretación ("profesores de Matemática", "cursos que dicta Salinas")', 'Búsqueda por voz (Web Speech API) en navegadores compatibles', 'Filtros por carrera, ciclo, curso y dimensión; orden por dimensión', 'Huella de enseñanza, confiabilidad, cómo evalúa y teoría/práctica (calculadas en el navegador con la misma lógica del plugin)', 'Comparador de 2 o 3 secciones o docentes, solo diferencias, quitar y copiar enlace', 'Panel de accesibilidad completo, menú hamburguesa y navegación por teclado' ];
		const sim = [ [ 'Datos de docentes, cursos, secciones y reseñas', 'Archivo JavaScript fijo con datos ficticios (en el real: MySQL)' ], [ 'Inicio de sesión y registro', 'Dos cuentas de demostración sin contraseña (en el real: WordPress)' ], [ 'Publicar, editar y eliminar reseñas', 'localStorage de este navegador; cada compañero ve solo sus cambios' ], [ 'Marcar útil y reportar', 'localStorage; el ocultamiento automático por 3 reportes se explica pero no se alcanza con una sola persona' ], [ 'Panel de moderación', 'Página de la demo (en el real: panel de WordPress)' ], [ 'JZING Assistant', 'Respuestas generadas en el navegador con las mismas reglas del endpoint (en el real: Botpress Cloud + API de WordPress)' ], [ 'Enlace compartido del comparador', 'Funciona en la misma computadora que tenga la demo; no está publicado en internet' ] ];
		return { title: 'Sobre esta demostración — JZING', html: `${ head( [ home, [ 'Sobre esta demo' ] ], 'Sobre esta demostración', 'Versión estática para enseñar la interfaz. No necesita servidor, base de datos ni instalación.', true ) }
<div class="jz-container jz-container--narrow jz-page-body"><article class="jz-prose">
	<h2>Funciona igual que en la plataforma</h2><ul>${ real.map( ( x ) => `<li>${ e( x ) }</li>` ).join( '' ) }</ul>
	<h2>Funciones simuladas ${ C.sim( 'Simulado' ) }</h2>
	<div class="jz-compare-scroll"><table class="jz-compare" style="--cols:1"><thead><tr><th scope="col">Función</th><th scope="col">Cómo se simula</th></tr></thead><tbody>${ sim.map( ( [ a, b ] ) => `<tr><th scope="row">${ e( a ) }</th><td>${ e( b ) }</td></tr>` ).join( '' ) }</tbody></table></div>
	<h2>Datos de ejemplo</h2><p>${ JZ.courses().length } cursos, ${ JZ.docentes().length } docentes y ${ JZ.publishedReviews().length } reseñas publicadas, todos ficticios. Ningún nombre corresponde a un docente real de la UPC.</p>
	<p>JZING es un proyecto académico independiente y no es un servicio oficial de la Universidad Peruana de Ciencias Aplicadas (UPC).</p>
	<h2>Reiniciar la demostración</h2><p>Borra la sesión, las reseñas creadas, las marcas, los reportes y el comparador guardados en este navegador. Las preferencias de accesibilidad se mantienen.</p>
	<p><button type="button" class="jz-btn jz-btn--danger" data-demo-reset>${ i( 'trash' ) }<span>Reiniciar datos de la demo</span></button></p>
</article></div>` };
	};

	P.notFound = () => ( { title: 'Página no encontrada — JZING', html: `<div class="jz-container jz-container--narrow jz-page-body jz-404"><p class="jz-404__code" aria-hidden="true">404</p><h1 class="jz-page-title">No encontramos esta página</h1><p class="jz-lead">Puede que el enlace haya cambiado. Busca el curso o docente que necesitas:</p>${ C.searchForm( { id: 'jz-404-search', size: 'lg' } ) }<p><a class="jz-btn jz-btn--secondary" href="#/">Volver al inicio</a></p></div>` } );
}() );
