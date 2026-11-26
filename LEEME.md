# JZING — Demostración visual (versión estática)

Versión navegable de la interfaz de JZING para mostrarla sin instalar nada.
**No reemplaza** al proyecto original (WordPress + plugin JZING Core), que es el que se desplegará en AWS.

## Cómo abrirla

1. Descomprime `jzing-demo.zip`.
2. Entra a la carpeta `jzing-demo` y abre `index.html` con doble clic (o arrástralo a Chrome).

No hace falta Docker, WordPress, MySQL, PHP ni un servidor local. Funciona en Chrome, Edge y Firefox recientes.
Con internet se descarga la tipografía Poppins; sin internet se usa una tipografía del sistema y todo lo demás funciona igual.

## Qué funciona igual que en la plataforma

- Diseño completo: los cuatro archivos CSS son copias sin cambios de los del tema (`base`, `layout`, `components`, `pages`).
- Navegación entre todas las páginas, menú hamburguesa, migas de pan y pie de página.
- Búsqueda escrita con sugerencias e interpretación ("profesores de Matemática", "cursos que dicta Salinas").
- Búsqueda por voz (Web Speech API, es-PE) en navegadores compatibles. Necesita micrófono e internet.
- Filtros (carrera, ciclo, curso, valor mínimo por dimensión, "apta para quienes trabajan") y orden por dimensión.
- Huella de enseñanza, confiabilidad, cómo evalúa y teoría/práctica. Se calculan en el navegador con las mismas reglas del plugin.
- Comparador de 2 o 3 secciones o docentes: mejor valor por fila, "solo diferencias", quitar elementos y copiar el enlace.
- Panel de accesibilidad completo (contraste, modo oscuro, fondos de lectura, tamaño de texto, espaciado, interlineado, tipografías, subrayado de enlaces, menos animaciones) y navegación con teclado.

## Qué está simulado

Todo lo simulado se marca en pantalla con una etiqueta de borde punteado ("Simulado") o un aviso.

| Función | En la demo | En el proyecto real |
|---|---|---|
| Datos de docentes, cursos, secciones y reseñas | `assets/js/data.js`, con datos ficticios exportados del sembrador del plugin | MySQL vía WordPress |
| Inicio de sesión y registro | Dos cuentas demo sin contraseña: estudiante y moderador | Usuarios de WordPress |
| Publicar, editar y eliminar reseñas | `localStorage` del navegador | API REST del plugin + MySQL |
| Marcar "Útil" y reportar | `localStorage` | API REST + límites de frecuencia |
| Moderación | Página de la demo | Panel de WordPress (rol "Moderador JZING") |
| JZING Assistant | Respuestas generadas en el navegador con las reglas del endpoint | Botpress Cloud + API de WordPress |
| Enlace compartido del comparador | Solo funciona en una computadora que tenga la demo | URL pública del sitio |

Cada persona ve solo sus propios cambios porque se guardan en su navegador.
Para empezar de cero, usa **Sobre esta demo → Reiniciar datos de la demo**.

## Recorrido sugerido para la presentación

1. Busca "Base de Datos" o dicta "profesores de Matemática" en el buscador de la portada.
2. Abre un curso, filtra por "Claridad ≥ 4" y agrega dos o tres secciones al comparador.
3. Pulsa **Comparar ahora** y activa "Mostrar solo diferencias".
4. **Iniciar sesión → Entrar como estudiante** y publica una reseña. Queda "En revisión".
5. Sal y **entra como moderador**. En **Moderación**, apruébala y verás cómo cambia la huella del docente.
6. Abre **Accesibilidad**, prueba el alto contraste o el texto al 150 %, y recarga la página: se mantiene.
7. Abre el **Asistente** y pregunta "¿Qué cursos dicta Salinas?".

## Estructura

```
jzing-demo/
├── index.html            ← archivo principal
├── LEEME.md
└── assets/
    ├── css/  base, layout, components, pages (del tema) + demo.css (solo lo propio de la demo)
    └── js/   data.js → core.js → assistant-engine.js → components.js → pages.js → ui.js → app.js
```

Son scripts clásicos (sin módulos ni `fetch`), así que funcionan al abrir el archivo directamente (`file://`).

JZING es un proyecto académico independiente. No es un servicio oficial de la Universidad Peruana de Ciencias Aplicadas (UPC).
Ningún nombre de la demo corresponde a un docente real.
