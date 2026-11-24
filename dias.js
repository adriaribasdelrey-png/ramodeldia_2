// Ramos que ya existen, en orden de fecha. Cada uno está en dias/<fecha>.html.
// fondo y colores [pétalo, centro, hoja] sirven para dibujar su miniatura en la galería «Ramos».
// Lo actualiza la tarea programada «Ramo del día» cada vez que prepara uno nuevo.
window.RAMOS = [
  { fecha: "2026-11-24", estilo: "Pixel art", fondo: "#0d0206", colores: ["#bc3848", "#f0cbbd", "#8f7150"] },
  { fecha: "2026-11-25", estilo: "Ilustración de tinta", fondo: "#f3ead8", colores: ["#c0603e", "#d9a441", "#8a9a7b"] },
  { fecha: "2026-11-26", estilo: "Realista", fondo: "#10182b", colores: ["#e8796b", "#fbe3d3", "#5c6b3a"] }
];
window.DIAS = window.RAMOS.map((r) => r.fecha);
