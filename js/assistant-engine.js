/*
 * JZING demo — motor de JZING Assistant (SIMULADO en el navegador).
 * En el proyecto real, Botpress Cloud envía el mensaje a WordPress
 * (/wp-json/jzing/v1/bot/consulta). Aquí se ejecutan las mismas reglas
 * sobre los datos de ejemplo. No usa IA ni inventa registros.
 */
( function () {
	'use strict';
	const JZ = window.JZ;

	const SUGG = [ '¿Qué es JZING?', 'Busca docentes de Base de Datos', '¿Cómo interpreto las evaluaciones?', '¿Cómo puedo comparar dos secciones?' ];
	const FAQ = [
		{ id: 'saludo', p: [ /^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|que tal)\b/, /^(ayuda|menu|opciones|empezar|inicio)$/ ], t: '¡Hola! Soy JZING Assistant. Puedo ayudarte a buscar cursos y docentes, explicarte las evaluaciones por dimensiones y cómo comparar secciones. ¿Qué necesitas?', l: [], s: SUGG },
		{ id: 'que_es', p: [ /que es jzing/, /para que sirve/, /de que trata/, /que es esta (pagina|plataforma|web)/ ], t: 'JZING es un proyecto académico independiente que organiza experiencias de estudiantes sobre docentes y secciones en siete dimensiones de enseñanza. No publica rankings de "mejores" docentes ni un puntaje único: te muestra cómo enseña cada docente para que tú decidas. No es un servicio oficial de la UPC.', l: [ [ 'Cómo funciona', '#/inicio/como-funciona' ] ], s: [ '¿Cómo interpreto las evaluaciones?', '¿Cómo busco un curso?' ] },
		{ id: 'oficial', p: [ /es oficial/, /oficial de la upc/, /matricul/ ], t: 'JZING no es un servicio oficial de la UPC y no realiza matrículas. Úsalo para informarte y luego matricúlate en el sistema oficial de la universidad.', l: [], s: [ '¿Qué es JZING?' ] },
		{ id: 'buscar_cursos', p: [ /como (busco|buscar|encuentro|encontrar|veo|ver) (un |los |mis )?(curso|cursos|materia)/ ], t: 'Entra a «Cursos» y escribe el nombre o el código (por ejemplo, «base de datos» o «JZ-BD201»). Desde el tercer carácter verás sugerencias. También puedes usar el micrófono del buscador o filtrar por carrera y ciclo.', l: [ [ 'Explorar cursos', '#/cursos' ] ], s: [ 'Busca cursos de programación' ] },
		{ id: 'buscar_docentes', p: [ /como (busco|buscar|encuentro|encontrar|veo|ver) (a )?(un |los )?(docente|docentes|profesor|profesores|profe)/ ], t: 'Entra a «Docentes» y busca por nombre, o escribe el curso para ver quién lo dicta (por ejemplo, «profesores de Cálculo»).', l: [ [ 'Ver docentes', '#/docentes' ] ], s: [ 'Busca docentes de Base de Datos' ] },
		{ id: 'interpretar', p: [ /como (interpreto|interpretar|leo|leer|entiendo|entender)/, /que (significa|significan|son) (las )?(dimensiones|la huella|los valores)/, /huella de ensenanza/, /del 1 al 5/ ], t: 'Cada docente tiene una "huella" de siete dimensiones del 1 al 5: claridad, justicia al calificar, flexibilidad, carga de trabajo, enfoque práctico, dinamismo y retroalimentación. En carga de trabajo un valor alto significa MÁS carga, no "mejor". Con menos de 3 reseñas verás "Datos insuficientes". Revisa también la confiabilidad: alta (20+ reseñas recientes), media (8 a 19) o baja (menos de 8).', l: [ [ 'Las siete dimensiones', '#/inicio/dimensiones' ] ], s: [ '¿Qué es la confiabilidad?', '¿Cómo puedo comparar dos secciones?' ] },
		{ id: 'confiabilidad', p: [ /confiabilidad/, /confiable/ ], t: 'La confiabilidad indica cuánto respaldo tiene una evaluación según las reseñas de los dos últimos ciclos: alta con 20 o más, media de 8 a 19 y baja con menos de 8.', l: [], s: [ '¿Cómo interpreto las evaluaciones?' ] },
		{ id: 'comparar', p: [ /como (comparo|comparar|puedo comparar)/, /comparador/, /comparar (dos|tres|secciones|docentes)/ ], t: 'Abre un curso y pulsa «Comparar» en dos o tres secciones del mismo curso. Luego pulsa «Comparar ahora» en la barra inferior. Verás las secciones lado a lado; puedes activar «Mostrar solo diferencias» y compartir el enlace.', l: [ [ 'Ir al comparador', '#/comparar' ] ], s: [ 'Busca cursos de matemática' ] },
		{ id: 'resenas', p: [ /como (publico|publicar|dejo|dejar|escribo|escribir) (una )?resena/, /anonim/, /se vera mi nombre/ ], t: 'Para reseñar necesitas iniciar sesión. Valoras las siete dimensiones y dejas un comentario de 30 a 500 caracteres. Tu nombre no se muestra: solo tu carrera y ciclo, si decides indicarlos. Las reseñas pasan por moderación.', l: [ [ 'Publicar una reseña', '#/publicar-resena' ] ], s: [] },
		{ id: 'accesibilidad', p: [ /accesibilidad/, /dislexia/, /tamano de (letra|texto)/, /letra (mas )?grande/, /alto contraste/, /modo oscuro/, /interlineado/, /tipografia/ ], t: 'Pulsa el botón «Accesibilidad» de la cabecera. Puedes activar alto contraste, modo oscuro o fondo crema, cambiar el tamaño del texto, el espaciado entre letras, el interlineado y la tipografía, y reducir animaciones. Tus preferencias se guardan solo en tu navegador.', l: [ [ 'Declaración de accesibilidad', '#/accesibilidad' ] ], s: [ '¿Cómo uso la búsqueda por voz?' ] },
		{ id: 'voz', p: [ /busqueda por voz/, /microfono/, /por voz/ ], t: 'Pulsa el ícono de micrófono del buscador, acepta el permiso y di, por ejemplo, «Buscar profesores de Matemática». Verás el texto reconocido y podrás corregirlo. Funciona en navegadores compatibles como Chrome, Edge o Safari.', l: [], s: [] },
		{ id: 'gracias', p: [ /^(gracias|muchas gracias|genial|perfecto|listo)\b/ ], t: '¡De nada! Si necesitas algo más, aquí estoy.', l: [], s: SUGG },
	];

	function reply( text, intent, links, suggestions, ctx ) {
		return { text, intent, links: ( links || [] ).slice( 0, 6 ), suggestions: ( suggestions || [] ).slice( 0, 4 ), ctx };
	}
	function notFound( term, what, ctx ) {
		const subj = { docentes: 'docentes registrados', cursos: 'cursos registrados', docente: 'ningún docente registrado', todo: 'cursos ni docentes registrados' }[ what ];
		return reply( term ? `No encontré ${ subj } en JZING para «${ term }». Revisa la ortografía o prueba con el código del curso. Solo muestro información registrada en la plataforma.` : 'No encontré ese registro en JZING.', 'no_encontrado', [], [ '¿Cómo busco un curso?' ], ctx );
	}
	function coursesOf( id, ctx ) {
		const d = JZ.docente( id );
		ctx.docente = id;
		const lines = d.courses.map( ( c ) => `• ${ c.title } (${ c.code })` );
		return reply( `${ d.name } tiene registrados estos cursos:\n${ lines.join( '\n' ) }`, 'cursos_docente', [ [ 'Ver perfil — ' + d.name, '#/docentes/' + d.slug ] ], [ 'Muéstrame las evaluaciones de este docente' ], ctx );
	}
	function evaluationOf( id, ctx ) {
		const d = JZ.docente( id );
		ctx.docente = id;
		if ( ! d.stats.count ) {
			return reply( `${ d.name } todavía no tiene reseñas publicadas.`, 'evaluacion', [ [ d.name, '#/docentes/' + d.slug ] ], [], ctx );
		}
		const lines = JZ.DIMS.map( ( dim ) => {
			const v = d.stats.dims[ dim.key ];
			return `• ${ dim.label }: ${ v.enough ? `${ JZ.num( v.avg ) } de 5 (${ v.count } reseñas)` : 'datos insuficientes' }`;
		} );
		return reply( `Huella de enseñanza de ${ d.name } (${ d.rel.label.toLowerCase() }, ${ d.stats.count } reseñas en total):\n${ lines.join( '\n' ) }\nRecuerda: en carga de trabajo, un valor alto significa más carga.`, 'evaluacion', [ [ 'Ver perfil completo', '#/docentes/' + d.slug ] ], [ '¿Qué cursos dicta este profesor?' ], ctx );
	}
	function pick( term, display, ctx, fn ) {
		const docs = JZ.docentes( { q: term } );
		if ( ! docs.length ) {
			return notFound( display, 'docente', ctx );
		}
		if ( docs.length > 1 ) {
			return reply( 'Encontré varios docentes con ese nombre. ¿Cuál de ellos?\n' + docs.map( ( d ) => '• ' + d.name ).join( '\n' ), 'desambiguar', docs.map( ( d ) => [ d.name, '#/docentes/' + d.slug ] ), docs.slice( 0, 3 ).map( ( d ) => 'Evaluaciones de ' + d.name ), ctx );
		}
		return fn( docs[ 0 ].id, ctx );
	}

	JZ.assistantRespond = function ( message, context ) {
		const ctx = { docente: ( context && context.docente ) || 0 };
		message = String( message || '' ).trim().slice( 0, 300 );
		const n = JZ.normalize( message );
		if ( ! n ) {
			return reply( FAQ[ 0 ].t, 'menu', [], SUGG, ctx );
		}
		for ( const f of FAQ ) {
			if ( f.p.some( ( re ) => re.test( n ) ) ) {
				return reply( f.t, 'faq_' + f.id, f.l, f.s, ctx );
			}
		}
		if ( /\b(significa|que es|explica)\b/.test( n ) ) {
			const dim = JZ.DIMS.find( ( d ) => n.includes( JZ.normalize( d.short ) ) || n.includes( JZ.normalize( d.label ) ) );
			if ( dim ) {
				return reply( `${ dim.label }: ${ dim.description }`, 'dimension', [], [ '¿Cómo interpreto las evaluaciones?' ], ctx );
			}
		}
		const refers = /\b(este|esta|ese|esa)\s+(profesora?|profe|docente|maestr[oa])\b/.test( n );
		if ( refers && ctx.docente ) {
			return /\b(cursos?|materias?|dicta|ensena)\b/.test( n ) ? coursesOf( ctx.docente, ctx ) : evaluationOf( ctx.docente, ctx );
		}
		const i = JZ.interpret( message );
		if ( refers && ! i.term ) {
			return reply( '¿De qué docente hablas? Escribe su nombre, por ejemplo: «Muéstrame las evaluaciones de Andrea Salinas».', 'falta_docente', [], [ 'Busca docentes de Base de Datos' ], ctx );
		}
		if ( ! i.term ) {
			return reply( 'No estoy seguro de haber entendido. Puedo buscar cursos o docentes registrados, mostrar evaluaciones por dimensiones y explicarte cómo usar JZING:', 'fallback', [], SUGG, ctx );
		}
		if ( i.intent === 'cursos_de_docente' ) {
			return pick( i.term, i.display, ctx, coursesOf );
		}
		if ( i.intent === 'evaluaciones_docente' ) {
			return pick( i.term, i.display, ctx, evaluationOf );
		}
		const type = i.intent === 'docentes' || i.intent === 'cursos' ? i.intent : 'todo';
		const r = JZ.search( message, type, 5 );
		if ( ! r.total ) {
			const explicit = /\b(busca\w*|encuentra\w*|muestra\w*|ver|curso|cursos|codigo|profes\w*|docentes?)\b/.test( n );
			return explicit ? notFound( i.display, type, ctx ) : reply( 'No estoy seguro de haber entendido. Puedo buscar cursos o docentes registrados, mostrar evaluaciones por dimensiones y explicarte cómo usar JZING:', 'fallback', [], SUGG, ctx );
		}
		const lines = [];
		const links = [];
		r.cursos.forEach( ( c ) => {
			lines.push( `• Curso: ${ c.title } (${ c.code }) — ${ JZ.plural( c.sections.length, 'sección', 'secciones' ) } este ciclo` );
			links.push( [ c.title, '#/cursos/' + c.slug ] );
		} );
		r.docentes.forEach( ( d ) => {
			lines.push( `• Docente: ${ d.name } — ${ d.courses.map( ( c ) => c.title ).join( ', ' ) } (${ d.rel.label })` );
			links.push( [ d.name, '#/docentes/' + d.slug ] );
		} );
		if ( r.docentes.length === 1 ) {
			ctx.docente = r.docentes[ 0 ].id;
		}
		const head = type === 'docentes' ? `Encontré estos docentes relacionados con «${ i.display }»:` : type === 'cursos' ? `Estos cursos coinciden con «${ i.display }»:` : `Esto encontré para «${ i.display }»:`;
		return reply( head + '\n' + lines.join( '\n' ), type, links, r.docentes.length ? [ 'Muéstrame las evaluaciones de este docente' ] : [ '¿Cómo puedo comparar dos secciones?' ], ctx );
	};
	JZ.assistantSuggestions = SUGG;
}() );
