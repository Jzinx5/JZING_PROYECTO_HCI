/*
 * JZING demo — núcleo (script clásico, sin módulos ni fetch: funciona con file://).
 * Reproduce en JavaScript la lógica del plugin JZING Core:
 *   ciclos, huella de enseñanza, confiabilidad, búsqueda interpretada y asistente.
 * Lo que en WordPress se guarda en MySQL aquí se SIMULA con localStorage.
 */
( function () {
	'use strict';
	const D = window.JZ_DATA;
	const JZ = ( window.JZ = window.JZ || {} );

	/* Utilidades ------------------------------------------------------------ */
	JZ.esc = ( v ) => String( v == null ? '' : v ).replace( /[&<>"']/g, ( c ) => ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ c ] ) );
	JZ.num = ( v ) => ( v == null ? '—' : Number( v ).toFixed( 1 ).replace( '.', ',' ) );
	JZ.plural = ( n, one, many ) => `${ n } ${ n === 1 ? one : many }`;
	JZ.normalize = ( t ) => String( t || '' ).normalize( 'NFD' ).replace( /[̀-ͯ]/g, '' ).toLowerCase().replace( /[^a-z0-9ñ\s-]/g, ' ' ).replace( /\s+/g, ' ' ).trim();
	JZ.initials = ( name ) => {
		const p = String( name ).replace( /^(prof\.?|dr\.?|dra\.?|mg\.?|ing\.?)\s+/i, '' ).trim().split( /\s+/ );
		return ( ( p[ 0 ] || '' ).charAt( 0 ) + ( p[ 1 ] || '' ).charAt( 0 ) ).toUpperCase();
	};
	JZ.PERIOD = D.period;
	JZ.DIMS = D.dimensions;
	JZ.DIM_KEYS = D.dimensions.map( ( d ) => d.key );
	JZ.MIN_REVIEWS = 3;
	JZ.higherIsBetter = ( k ) => k !== 'carga';
	JZ.EVAL_LABELS = { controles: 'Controles', proyectos: 'Proyectos', examenes: 'Exámenes', laboratorios: 'Laboratorios', exposiciones: 'Exposiciones', sorpresa: 'Controles sorpresa' };
	JZ.WORK_LABELS = { individual: 'Mayormente individual', grupal: 'Mayormente grupal', mixto: 'Mixto' };
	JZ.REPORT_REASONS = { ofensiva: 'Es ofensiva o irrespetuosa', falsa: 'Parece falsa o malintencionada', no_corresponde: 'No corresponde a este curso o docente', datos_personales: 'Incluye datos personales', otro: 'Otro motivo' };
	JZ.DAY_SHORT = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb' };
	JZ.DAY_LONG = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado' };

	/* Ciclos -------------------------------------------------------------- */
	const P = ( JZ.periods = {
		valid: ( p ) => /^20\d{2}-(10|20)$/.test( p ),
		index: ( p ) => ( P.valid( p ) ? Number( p.slice( 0, 4 ) ) * 2 + ( p.slice( 5 ) === '20' ? 1 : 0 ) : 0 ),
		from: ( i ) => `${ Math.floor( i / 2 ) }-${ i % 2 === 0 ? '10' : '20' }`,
		age: ( p ) => Math.max( 0, P.index( JZ.PERIOD ) - P.index( p ) ),
		recent: ( p ) => P.valid( p ) && P.age( p ) <= 1,
		old: ( p ) => P.valid( p ) && P.age( p ) > 4,
		list: ( n = 8 ) => Array.from( { length: n }, ( _, i ) => P.from( P.index( JZ.PERIOD ) - i ) ),
	} );

	/* Almacenamiento SIMULADO (reemplaza a MySQL) ---------------------------- */
	const KEY = 'jzdemo:estado';
	const blank = () => ( { user: null, reviews: [], helpful: {}, reports: {}, hidden: {}, seq: 1 } );
	let state;
	try {
		state = Object.assign( blank(), JSON.parse( localStorage.getItem( KEY ) || '{}' ) );
	} catch ( e ) {
		state = blank();
	}
	JZ.store = {
		get: () => state,
		save() {
			try {
				localStorage.setItem( KEY, JSON.stringify( state ) );
			} catch ( e ) { /* modo privado: solo durante esta visita */ }
		},
		reset() {
			state = blank();
			try {
				localStorage.removeItem( KEY );
				localStorage.removeItem( 'jzing:compare' );
			} catch ( e ) {}
		},
	};
	JZ.USERS = {
		estudiante: { id: 'estudiante', name: 'Estudiante demo', role: 'estudiante' },
		moderador: { id: 'moderador', name: 'Moderador demo', role: 'moderador' },
	};
	JZ.user = () => state.user;
	JZ.isMod = () => !! state.user && state.user.role === 'moderador';

	/* Índices -------------------------------------------------------------- */
	const byId = ( arr ) => Object.fromEntries( arr.map( ( x ) => [ x.id, x ] ) );
	const COURSES = byId( D.courses );
	const DOCS = byId( D.docentes );
	const CAREERS = Object.fromEntries( D.careers.map( ( c ) => [ c.slug, c.name ] ) );
	D.courses.forEach( ( c ) => ( c.key = ' ' + JZ.normalize( c.title + ' ' + c.code ) + ' ' ) );
	D.docentes.forEach( ( d ) => ( d.key = ' ' + JZ.normalize( d.name + ' ' + d.area ) + ' ' ) );
	JZ.careers = () => D.careers;
	JZ.careerName = ( slug ) => CAREERS[ slug ] || slug;

	/* Reseñas: base demo + creadas en el navegador ---------------------------- */
	function baseReview( r ) {
		const dims = {};
		JZ.DIM_KEYS.forEach( ( k, i ) => ( dims[ k ] = r.d[ i ] ) );
		return { ...r, dims, status: 'publish', author: null };
	}
	const BASE_REVIEWS = D.reviews.map( baseReview );
	JZ.allReviews = () => {
		const local = state.reviews.map( ( r ) => ( { ...r } ) );
		return BASE_REVIEWS.concat( local ).map( ( r ) => {
			const hidden = state.hidden[ r.id ];
			const extra = state.helpful[ r.id ] ? 1 : 0;
			return { ...r, status: hidden ? 'oculta' : r.status, util: ( r.util || 0 ) + extra, utilMine: !! state.helpful[ r.id ], reported: !! state.reports[ r.id ] };
		} );
	};
	JZ.publishedReviews = () => JZ.allReviews().filter( ( r ) => r.status === 'publish' );

	/* Huella de enseñanza (misma lógica que Stats.php) ---------------------- */
	function emptyBucket() {
		const dims = {};
		JZ.DIM_KEYS.forEach( ( k ) => ( dims[ k ] = { sum: 0, n: 0 } ) );
		return { count: 0, recent: 0, dims, respeta: [ 0, 0 ], fechas: [ 0, 0 ], vivo: [ 0, 0 ], teoria: [ 0, 0 ], trabajo: { individual: 0, grupal: 0, mixto: 0, n: 0 }, evals: Object.fromEntries( Object.keys( JZ.EVAL_LABELS ).map( ( k ) => [ k, 0 ] ) ), evalsN: 0 };
	}
	function add( b, r ) {
		b.count++;
		if ( P.recent( r.period ) ) {
			b.recent++;
		}
		JZ.DIM_KEYS.forEach( ( k ) => {
			const v = r.dims[ k ];
			if ( v >= 1 && v <= 5 ) {
				b.dims[ k ].sum += v;
				b.dims[ k ].n++;
			}
		} );
		[ 'respeta', 'fechas', 'vivo' ].forEach( ( f ) => {
			b[ f ][ 1 ]++;
			b[ f ][ 0 ] += r[ f ] ? 1 : 0;
		} );
		b.teoria[ 0 ] += r.teoria;
		b.teoria[ 1 ]++;
		if ( b.trabajo[ r.trabajo ] !== undefined ) {
			b.trabajo[ r.trabajo ]++;
			b.trabajo.n++;
		}
		if ( r.evals && r.evals.length ) {
			b.evalsN++;
			r.evals.forEach( ( e ) => {
				if ( b.evals[ e ] !== undefined ) {
					b.evals[ e ]++;
				}
			} );
		}
	}
	function finalize( b ) {
		const min = JZ.MIN_REVIEWS;
		const dims = {};
		JZ.DIM_KEYS.forEach( ( k ) => {
			const d = b.dims[ k ];
			const enough = d.n >= min;
			dims[ k ] = { avg: enough ? Math.round( ( d.sum / d.n ) * 10 ) / 10 : null, count: d.n, enough };
		} );
		const pct = ( [ y, n ] ) => ( n >= min ? Math.round( ( 100 * y ) / n ) : null );
		const level = b.recent >= 20 ? 'alta' : b.recent >= 8 ? 'media' : 'baja';
		const teoria = b.teoria[ 1 ] >= min ? Math.round( b.teoria[ 0 ] / b.teoria[ 1 ] / 10 ) * 10 : null;
		let trabajo = null;
		if ( b.trabajo.n >= min ) {
			trabajo = {};
			[ 'individual', 'grupal', 'mixto' ].forEach( ( m ) => ( trabajo[ m ] = Math.round( ( 100 * b.trabajo[ m ] ) / b.trabajo.n ) ) );
		}
		let evals = null;
		if ( b.evalsN >= min ) {
			evals = {};
			Object.keys( b.evals ).forEach( ( e ) => ( evals[ e ] = Math.round( ( 100 * b.evals[ e ] ) / b.evalsN ) ) );
		}
		const apta = level !== 'baja' && dims.flexibilidad.enough && dims.carga.enough && dims.flexibilidad.avg >= 4 && dims.carga.avg <= 3;
		return { count: b.count, recent: b.recent, reliability: level, dims, teoria_pct: teoria, practica_pct: teoria == null ? null : 100 - teoria, herramientas_vivo: pct( b.vivo ), respeta_horario: pct( b.respeta ), fechas_anticipadas: pct( b.fechas ), trabajo, evaluaciones: evals, apta_trabajo: apta };
	}
	JZ.stats = ( docenteId, courseId = 0 ) => {
		const b = emptyBucket();
		JZ.publishedReviews().forEach( ( r ) => {
			if ( r.docente === docenteId && ( ! courseId || r.course === courseId ) ) {
				add( b, r );
			}
		} );
		return finalize( b );
	};
	JZ.reliabilityInfo = ( level, recent ) => ( {
		level,
		label: { alta: 'Confiabilidad alta', media: 'Confiabilidad media', baja: 'Confiabilidad baja' }[ level ],
		explain: `Se basa en ${ recent } reseñas de los dos últimos ciclos. Alta: 20 o más. Media: de 8 a 19. Baja: menos de 8. Más reseñas recientes = evaluación más representativa.`,
	} );

	/* Repositorio de lectura (equivale a Repository.php) --------------------- */
	JZ.scheduleText = ( sessions ) => {
		if ( ! sessions || ! sessions.length ) {
			return 'Horario por confirmar';
		}
		const groups = {};
		sessions.forEach( ( s ) => {
			const k = `${ s.inicio }–${ s.fin }`;
			( groups[ k ] = groups[ k ] || [] ).push( JZ.DAY_SHORT[ s.dia ] );
		} );
		return Object.entries( groups ).map( ( [ t, days ] ) => `${ [ ...new Set( days ) ].join( ' y ' ) } ${ t }` ).join( ' · ' );
	};
	JZ.courseSummary = ( id ) => ( COURSES[ id ] ? { id, title: COURSES[ id ].title, code: COURSES[ id ].code, slug: COURSES[ id ].slug } : null );
	JZ.docenteSummary = ( id ) => ( DOCS[ id ] ? { id, name: DOCS[ id ].name, slug: DOCS[ id ].slug, initials: JZ.initials( DOCS[ id ].name ) } : null );
	JZ.section = ( id ) => {
		const s = D.sections.find( ( x ) => x.id === id );
		if ( ! s ) {
			return null;
		}
		const stats = JZ.stats( s.docente, s.course );
		return { ...s, schedule: JZ.scheduleText( s.sessions ), courseObj: JZ.courseSummary( s.course ), docenteObj: JZ.docenteSummary( s.docente ), stats, rel: JZ.reliabilityInfo( stats.reliability, stats.recent ) };
	};
	JZ.sectionsFor = ( { course = 0, docente = 0, period = JZ.PERIOD } ) => D.sections
		.filter( ( s ) => ( ! course || s.course === course ) && ( ! docente || s.docente === docente ) && ( ! period || s.period === period ) )
		.map( ( s ) => JZ.section( s.id ) );
	JZ.course = ( idOrSlug ) => {
		const c = typeof idOrSlug === 'number' ? COURSES[ idOrSlug ] : D.courses.find( ( x ) => x.slug === idOrSlug );
		if ( ! c ) {
			return null;
		}
		const sections = JZ.sectionsFor( { course: c.id } );
		const docentes = {};
		sections.forEach( ( s ) => ( docentes[ s.docente ] = s.docenteObj ) );
		return { ...c, sections, docentes: Object.values( docentes ), careerNames: c.careers.map( JZ.careerName ) };
	};
	JZ.docenteIdsForCourse = ( cid ) => [ ...new Set( D.sections.filter( ( s ) => s.course === cid ).map( ( s ) => s.docente ) ) ];
	JZ.docente = ( idOrSlug, courseId = 0 ) => {
		const d = typeof idOrSlug === 'number' ? DOCS[ idOrSlug ] : D.docentes.find( ( x ) => x.slug === idOrSlug );
		if ( ! d ) {
			return null;
		}
		const courses = {};
		D.sections.filter( ( s ) => s.docente === d.id ).forEach( ( s ) => ( courses[ s.course ] = JZ.courseSummary( s.course ) ) );
		const stats = JZ.stats( d.id, courseId );
		return { ...d, initials: JZ.initials( d.name ), courses: Object.values( courses ).sort( ( a, b ) => a.title.localeCompare( b.title ) ), stats, rel: JZ.reliabilityInfo( stats.reliability, stats.recent ) };
	};
	const tokensMatch = ( key, tokens ) => tokens.every( ( t ) => key.includes( ' ' + t ) );
	JZ.courses = ( { q = '', carrera = '', ciclo = 0 } = {} ) => {
		const tokens = JZ.tokens( q );
		return D.courses.filter( ( c ) => tokensMatch( c.key, tokens ) && ( ! carrera || c.careers.includes( carrera ) ) && ( ! ciclo || c.ciclo === ciclo ) ).map( ( c ) => JZ.course( c.id ) );
	};
	JZ.docentes = ( { q = '', curso = 0, include = null } = {} ) => {
		const tokens = JZ.tokens( q );
		const allowed = curso ? JZ.docenteIdsForCourse( curso ) : null;
		return D.docentes.filter( ( d ) => tokensMatch( d.key, tokens ) && ( ! allowed || allowed.includes( d.id ) ) && ( ! include || include.includes( d.id ) ) ).map( ( d ) => JZ.docente( d.id ) );
	};
	JZ.reviewsFor = ( docenteId, { curso = 0, periodo = '', orden = 'reciente' } = {} ) => {
		const list = JZ.publishedReviews().filter( ( r ) => r.docente === docenteId && ( ! curso || r.course === curso ) && ( ! periodo || r.period === periodo ) );
		list.sort( ( a, b ) => ( orden === 'util' ? b.util - a.util || b.date.localeCompare( a.date ) : b.date.localeCompare( a.date ) ) );
		return list;
	};
	JZ.compare = ( type, ids ) => {
		ids = [ ...new Set( ids.filter( Boolean ) ) ].slice( 0, 3 );
		let error = '';
		const items = [];
		if ( type === 'docentes' ) {
			ids.forEach( ( id ) => {
				const d = JZ.docente( id );
				if ( d ) {
					items.push( d );
				}
			} );
		} else {
			let course = 0;
			ids.forEach( ( id ) => {
				const s = JZ.section( id );
				if ( ! s ) {
					return;
				}
				if ( course && s.course !== course ) {
					error = 'Solo puedes comparar secciones del mismo curso. Se omitieron las de otro curso.';
					return;
				}
				course = s.course;
				items.push( s );
			} );
		}
		return { type: type === 'docentes' ? 'docentes' : 'secciones', items, error };
	};
	JZ.reviewTargets = () => {
		const seen = {};
		D.sections.forEach( ( s ) => {
			const c = COURSES[ s.course ];
			const d = DOCS[ s.docente ];
			seen[ s.docente + ':' + s.course ] = { docente: s.docente, course: s.course, label: `${ c.title } (${ c.code }) — ${ d.name }`, sort: c.title + d.name };
		} );
		return Object.values( seen ).sort( ( a, b ) => a.sort.localeCompare( b.sort ) );
	};

	/* Búsqueda interpretada (equivale a Search.php) --------------------------- */
	const COMMAND = 'buscar busca buscame busco buscamos encuentra encontrar encuentrame muestrame muestra mostrar ver quiero quisiera necesito dame lista listar listame por favor porfa hola jzing sobre informacion info conocer saber puedes podrias me ayuda ayudame todos todas'.split( ' ' );
	const STOP = 'de del la las el los un una unos unas y e en para que con a al mi mis se su sus dictan dicta ensenan ensena llevan curso cursos materia materias asignatura asignaturas clase clases profesor profesora profesores profesoras profe profes docente docentes maestro maestra maestros maestras este esta ese esa cual cuales como quien evaluacion evaluaciones resena resenas opiniones opinion calificaciones huella dimensiones'.split( ' ' );
	const DOC_WORDS = 'profesor profesora profesores profesoras profe profes docente docentes maestro maestra maestros maestras'.split( ' ' );
	const COURSE_WORDS = 'curso cursos materia materias asignatura asignaturas'.split( ' ' );
	JZ.tokens = ( text, stem = true ) => {
		const out = [];
		JZ.normalize( text ).split( ' ' ).forEach( ( w ) => {
			if ( ! w || COMMAND.includes( w ) || STOP.includes( w ) ) {
				return;
			}
			if ( stem && w.length > 3 && w.endsWith( 's' ) ) {
				w = w.slice( 0, -1 );
			}
			if ( ! out.includes( w ) ) {
				out.push( w );
			}
		} );
		return out.slice( 0, 6 );
	};
	JZ.interpret = ( raw ) => {
		raw = String( raw || '' ).trim().slice( 0, 120 );
		const n = JZ.normalize( raw );
		let intent = 'todo';
		let subject = n;
		const dw = '(?:profesora?|profesores|profesoras|profes?|docentes?|maestr[oa]s?)';
		let m;
		if ( ( m = n.match( new RegExp( '(?:cursos|materias|asignaturas|clases)\\s+(?:que\\s+)?(?:dicta|ensena|da|tiene|lleva|imparte)\\s+(?:el\\s+|la\\s+)?(?:' + dw + '\\s+)?(.+)$' ) ) ) ) {
			intent = 'cursos_de_docente';
			subject = m[ 1 ];
		} else if ( ( m = n.match( /(?:que|cuales)\s+(?:cursos|materias)\s+(?:dicta|ensena)\s+(.+)$/ ) ) ) {
			intent = 'cursos_de_docente';
			subject = m[ 1 ];
		} else if ( ( m = n.match( new RegExp( '(?:evaluacion(?:es)?|resenas?|opiniones|calificaciones|huella|dimensiones)\\s+(?:de|del)\\s+(?:la\\s+|el\\s+)?(?:' + dw + '\\s+)?(.+)$' ) ) ) ) {
			intent = 'evaluaciones_docente';
			subject = m[ 1 ];
		} else {
			const words = n.split( ' ' );
			if ( words.some( ( w ) => DOC_WORDS.includes( w ) ) ) {
				intent = 'docentes';
			} else if ( words.some( ( w ) => COURSE_WORDS.includes( w ) ) ) {
				intent = 'cursos';
			}
		}
		const tokens = JZ.tokens( subject );
		const plain = JZ.tokens( subject, false );
		const display = raw.split( /\s+/ ).map( ( w ) => w.replace( /^[¿¡"'«(]+|[?!.,;:»"')]+$/g, '' ) ).filter( ( w ) => w && plain.includes( JZ.normalize( w ) ) ).join( ' ' ) || plain.join( ' ' );
		return { raw, normalized: n, intent, term: tokens.join( ' ' ), display };
	};
	function label( intent, t ) {
		if ( ! t ) {
			return '';
		}
		return { docentes: `Docentes relacionados con «${ t }»`, cursos: `Cursos que coinciden con «${ t }»`, cursos_de_docente: `Cursos que dicta «${ t }»`, evaluaciones_docente: `Evaluaciones del docente «${ t }»` }[ intent ] || `Resultados para «${ t }»`;
	}
	JZ.search = ( raw, type = 'todo', limit = 8 ) => {
		const i = JZ.interpret( raw );
		let intent = i.intent;
		if ( ( type === 'cursos' || type === 'docentes' ) && intent === 'todo' ) {
			intent = type;
		}
		let cursos = [];
		let docentes = [];
		if ( i.term ) {
			if ( intent === 'cursos_de_docente' || intent === 'evaluaciones_docente' ) {
				docentes = JZ.docentes( { q: i.term } );
				if ( intent === 'cursos_de_docente' ) {
					const seen = {};
					docentes.forEach( ( d ) => d.courses.forEach( ( c ) => ( seen[ c.id ] = JZ.course( c.id ) ) ) );
					cursos = Object.values( seen );
				}
			} else if ( intent === 'docentes' ) {
				const byName = JZ.docentes( { q: i.term } );
				const cs = JZ.courses( { q: i.term } );
				const ids = [ ...new Set( cs.flatMap( ( c ) => JZ.docenteIdsForCourse( c.id ) ) ) ];
				const byCourse = ids.length ? JZ.docentes( { include: ids } ) : [];
				const merged = {};
				byName.concat( byCourse ).forEach( ( d ) => ( merged[ d.id ] = d ) );
				docentes = Object.values( merged );
				cursos = cs.slice( 0, 4 );
			} else if ( intent === 'cursos' ) {
				cursos = JZ.courses( { q: i.term } );
			} else {
				cursos = JZ.courses( { q: i.term } );
				docentes = JZ.docentes( { q: i.term } );
			}
		}
		if ( type === 'cursos' ) {
			docentes = [];
		}
		if ( type === 'docentes' ) {
			cursos = [];
		}
		cursos = cursos.slice( 0, limit );
		docentes = docentes.slice( 0, limit );
		const total = cursos.length + docentes.length;
		let message = '';
		if ( ! i.term ) {
			message = 'Escribe el nombre o código de un curso, o el nombre de un docente.';
		} else if ( ! total ) {
			message = `No encontramos cursos ni docentes registrados para «${ i.raw }». Revisa la ortografía, prueba con el código del curso o con menos palabras.`;
		} else {
			message = JZ.plural( total, 'resultado', 'resultados' );
		}
		return { query: i.raw, intent, term: i.term, label: label( intent, i.display ), cursos, docentes, total, message };
	};

	/* Validación de reseñas (equivale a Reviews.php) -------------------------- */
	JZ.containsPersonalData = ( t ) => /(https?:\/\/|www\.)\S+/i.test( t ) || /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test( t ) || /\+?\d{7,}/.test( t.replace( /[\s\-.()]/g, '' ) );
	JZ.validateReview = ( data, editing ) => {
		const errors = [];
		if ( ! data.docente || ! data.course ) {
			errors.push( { key: 'curso_id', message: 'Selecciona el curso y el docente.' } );
		} else if ( ! JZ.docenteIdsForCourse( data.course ).includes( data.docente ) ) {
			errors.push( { key: 'curso_id', message: 'Ese docente no tiene secciones registradas en el curso elegido.' } );
		}
		if ( ! P.valid( data.period ) ) {
			errors.push( { key: 'periodo', message: 'Indica el ciclo en que llevaste el curso.' } );
		}
		JZ.DIMS.forEach( ( d ) => {
			if ( ! ( data.dims[ d.key ] >= 1 && data.dims[ d.key ] <= 5 ) ) {
				errors.push( { key: 'dim_' + d.key, message: `Valora «${ d.label }» del 1 al 5.` } );
			}
		} );
		if ( data.respeta === '' ) {
			errors.push( { key: 'respeta_horario', message: 'Indica si el docente respetaba el horario de clase.' } );
		}
		if ( data.fechas === '' ) {
			errors.push( { key: 'fechas_anticipadas', message: 'Indica si las fechas se comunicaban con anticipación.' } );
		}
		if ( ! data.trabajo ) {
			errors.push( { key: 'modalidad_trabajo', message: 'Indica si los trabajos eran individuales, grupales o mixtos.' } );
		}
		const n = data.comment.length;
		if ( n < 30 ) {
			errors.push( { key: 'comentario', message: `El comentario debe tener al menos 30 caracteres (llevas ${ n }).` } );
		} else if ( n > 500 ) {
			errors.push( { key: 'comentario', message: 'El comentario puede tener como máximo 500 caracteres.' } );
		} else if ( JZ.containsPersonalData( data.comment ) ) {
			errors.push( { key: 'comentario', message: 'Por privacidad, no incluyas enlaces, correos ni números de teléfono en el comentario.' } );
		}
		if ( ! errors.length && ! editing ) {
			const dup = state.reviews.find( ( r ) => r.course === data.course && r.period === data.period && r.author === ( state.user && state.user.id ) );
			if ( dup ) {
				errors.push( { key: 'general', message: 'Ya publicaste una reseña de este curso para ese ciclo. Puedes editarla desde «Mis reseñas».' } );
			}
		}
		return errors;
	};
	JZ.canEdit = ( r ) => !! state.user && ( JZ.isMod() || ( r.author === state.user.id && P.index( JZ.PERIOD ) <= P.index( r.period ) + 1 ) );
}() );
