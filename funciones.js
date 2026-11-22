document.addEventListener("DOMContentLoaded", () => {
    const iniciar = fn => { try { fn(); } catch (e) { console.error("GLAM:", fn.name, e); } };

    iniciar(configurarSobre);
    iniciar(cargarDatos);
    iniciar(configurarMenu);
    iniciar(configurarMusica);
    iniciar(configurarGaleria);
    iniciar(configurarVideo);
    iniciar(configurarFormulario);
    iniciar(configurarCargaFotosGLAM);
    iniciar(iniciarCuentaRegresiva);
    iniciar(generarQR);
    iniciar(configurarAnimaciones);
    iniciar(cargarInvitadoGLAM);
});

const $ = id => document.getElementById(id);
const tokenURL = () => new URLSearchParams(window.location.search).get("token");

/* ===== SOBRE ===== */
function configurarSobre() {
    const boton = $("botonAbrir"), sobre = $("sobreInicial"), invitacion = $("invitacion");
    if (!boton || !sobre || !invitacion) return;

    document.body.style.overflow = "hidden";

    boton.addEventListener("click", () => {
        if (boton.dataset.abriendo === "true") return;
        boton.dataset.abriendo = "true";
        boton.disabled = true;
        sobre.classList.add("abriendo");

        setTimeout(() => {
            invitacion.classList.remove("oculto");
            invitacion.style.display = "block";
            invitacion.style.opacity = "0";
            invitacion.style.transition = "opacity 1.2s ease";

            sobre.style.transition = "opacity .9s ease, transform .9s ease";
            sobre.style.opacity = "0";
            sobre.style.transform = "scale(1.04)";
            sobre.style.pointerEvents = "none";

            setTimeout(() => {
                sobre.style.display = "none";
                invitacion.style.opacity = "1";
                document.body.style.overflow = "auto";
                try { configurarAnimaciones(); } catch (e) {}
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 950);
        }, 1700);
    });
}

/* ===== DATOS ===== */
function cargarDatos() {
    const n = DATOS_BODA.nombres;
    const nombres = `${n.primero} & ${n.segundo}`;

    $("nombrePortada1").textContent = n.primero;
    $("nombrePortada2").textContent = n.segundo;
    $("paseNombres").textContent = nombres;
    $("nombresFinales").textContent = nombres;
    $("textoHistoria").textContent = DATOS_BODA.historia;
    $("firmaHistoria").textContent = nombres;

    const f = new Date(DATOS_BODA.fecha);
    const texto = f.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });

    $("fechaPortada").textContent = texto.toUpperCase().replace(/ DE /g, " · ");
    $("diaEvento").textContent = String(f.getDate()).padStart(2, "0");
    $("mesEvento").textContent = f.toLocaleDateString("es-ES", { month: "long" }).toUpperCase();
    $("anioEvento").textContent = f.getFullYear();
    $("paseFecha").textContent = texto;
    $("fechaFinal").textContent = `${f.getDate()} · ${f.getMonth() + 1} · ${f.getFullYear()}`;

    [cargarUbicaciones, cargarItinerario, cargarVestimenta, cargarRegalos].forEach(fn => {
        try { fn(); } catch (e) { console.error("GLAM:", fn.name, e); }
    });
}

function cargarUbicaciones() {
    const c = DATOS_BODA.ceremonia, r = DATOS_BODA.recepcion;
    $("nombreCeremonia").textContent = c.nombre;
    $("direccionCeremonia").textContent = c.direccion;
    $("nombreRecepcion").textContent = r.nombre;
    $("direccionRecepcion").textContent = r.direccion;
    $("mapaCeremonia").href = c.mapa || "https://www.google.com/maps";
    $("mapaRecepcion").href = r.mapa || "https://www.google.com/maps";
}

function cargarItinerario() {
    const cont = $("listaItinerario");
    if (!cont) return;
    cont.innerHTML = "";
    DATOS_BODA.itinerario.forEach(e => {
        const el = document.createElement("div");
        el.className = "evento-itinerario revelar";
        el.innerHTML = `
            <div class="evento-hora">${e.hora}</div>
            <div class="evento-punto"></div>
            <div class="evento-descripcion"><h3>${e.titulo}</h3><p>${e.descripcion}</p></div>`;
        cont.appendChild(el);
    });
}

function cargarVestimenta() {
    $("vestimentaTitulo").textContent = DATOS_BODA.vestimenta.titulo;
    $("vestimentaTexto").textContent = DATOS_BODA.vestimenta.descripcion;
    const cont = $("paletaColores");
    cont.innerHTML = "";
    DATOS_BODA.vestimenta.colores.forEach(color => {
        const m = document.createElement("span");
        m.className = "color-muestra";
        m.style.backgroundColor = color;
        cont.appendChild(m);
    });
}

function cargarRegalos() {
    const cont = $("listaRegalos");
    if (!cont || !Array.isArray(DATOS_BODA.regalos)) return;
    cont.innerHTML = "";
    DATOS_BODA.regalos.forEach(r => {
        const el = document.createElement("article");
        el.className = "regalo-item revelar";
        el.innerHTML = `
            <h3>${r.titulo}</h3>
            <p>${r.descripcion}</p>
            ${r.enlace ? `<a href="${r.enlace}" target="_blank" rel="noopener">Ver información ↗</a>` : ""}`;
        cont.appendChild(el);
    });
}

/* ===== MENÚ ===== */
function configurarMenu() {
    const menu = $("menuLateral"), fondo = $("fondoMenu");
    const abrir = () => { menu.classList.add("abierto"); fondo.classList.add("visible"); };
    const cerrar = () => { menu.classList.remove("abierto"); fondo.classList.remove("visible"); };

    $("botonMenu").addEventListener("click", abrir);
    $("cerrarMenu").addEventListener("click", cerrar);
    fondo.addEventListener("click", cerrar);
    document.querySelectorAll(".menu-lateral a").forEach(a => a.addEventListener("click", cerrar));
}

/* ===== MÚSICA ===== */
function configurarMusica() {
    const musica = $("musica"), boton = $("botonMusica");
    let sonando = false;

    boton.addEventListener("click", async () => {
        if (!sonando) {
            try {
                await musica.play();
                sonando = true;
                boton.textContent = "♫";
                boton.classList.add("activo");
            } catch (e) {
                alert("No se pudo reproducir la música. Comprueba que exista recursos/musica.mp3.");
            }
        } else {
            musica.pause();
            sonando = false;
            boton.textContent = "♪";
            boton.classList.remove("activo");
        }
    });
}

/* ===== CUENTA REGRESIVA ===== */
function iniciarCuentaRegresiva() {
    const objetivo = new Date(DATOS_BODA.fecha).getTime();

    function actualizar() {
        const d = objetivo - Date.now();
        if (d <= 0) {
            $("contador").innerHTML = "<h3>¡Hoy es nuestro gran día!</h3>";
            return;
        }
        const dos = n => String(Math.floor(n)).padStart(2, "0");
        $("dias").textContent = dos(d / 86400000);
        $("horas").textContent = dos((d / 3600000) % 24);
        $("minutos").textContent = dos((d / 60000) % 60);
        $("segundos").textContent = dos((d / 1000) % 60);
    }
    actualizar();
    setInterval(actualizar, 1000);
}

/* ===== GALERÍA Y VISOR ===== */
function configurarGaleria() {
    const visor = $("visorFotos"), img = $("imagenAmpliada");
    const cerrar = () => visor.classList.remove("visible");

    document.querySelectorAll(".foto-galeria").forEach(f => {
        f.addEventListener("click", () => {
            img.src = f.dataset.imagen;
            visor.classList.add("visible");
            const nav = visor.querySelector(".navegacion-vintage");
            const cont = visor.querySelector(".contador-vintage");
            if (nav) nav.style.display = "none";
            if (cont) cont.style.display = "none";
        });
    });

    $("cerrarVisor").addEventListener("click", cerrar);
    visor.addEventListener("click", e => { if (e.target === visor) cerrar(); });
}

function configurarVideo() {
    if (!DATOS_BODA.videoUrl) return;
    $("videoContenedor").innerHTML =
        `<iframe src="${DATOS_BODA.videoUrl}" title="Nuestro video" allowfullscreen></iframe>`;
}

/* ===== INVITADO PERSONALIZADO ===== */
window.glamInvitadoActual = null;

function cargarInvitadoGLAM() {
    const token = tokenURL();
    const mensaje = $("mensajeRSVP"), formulario = $("formularioRSVP");

    if (!token) {
        mensaje.textContent = "Abre tu enlace personal para confirmar tu asistencia.";
        formulario.style.display = "none";
        return;
    }
    if (!DATOS_BODA.rsvpEndpoint) {
        mensaje.textContent = "No se encuentra configurada la conexión GLAM.";
        formulario.style.display = "none";
        return;
    }

    window.glamInvitacionCallback = respuesta => {
        if (!respuesta || !respuesta.correcto) {
            mensaje.textContent = (respuesta && respuesta.mensaje) || "No se pudo identificar tu invitación.";
            formulario.style.display = "none";
            return;
        }

        window.glamInvitadoActual = respuesta;
        const inv = respuesta.invitado;
        const pases = Number(inv.pasesAsignados || 0);

        $("nombreInvitado").textContent = inv.nombre;
        $("pasesAsignados").textContent = pases;

        const sel = $("cantidadPases");
        sel.innerHTML = "";
        for (let i = 1; i <= pases; i++) {
            const o = document.createElement("option");
            o.value = i;
            o.textContent = i === 1 ? "1 persona" : i + " personas";
            sel.appendChild(o);
        }

        if (pases < 1) {
            mensaje.textContent = "Esta invitación no tiene pases disponibles.";
            formulario.style.display = "none";
            return;
        }
        if (inv.estadoRSVP === "CONFIRMADO") mensaje.textContent = "Tu asistencia ya fue registrada.";

        $("acompanantes").value = inv.acompanantes || "";
        cargarGaleriaPublicaGLAM();
    };

    const s = document.createElement("script");
    const sep = DATOS_BODA.rsvpEndpoint.includes("?") ? "&" : "?";
    s.src = DATOS_BODA.rsvpEndpoint + sep + "token=" + encodeURIComponent(token) + "&callback=glamInvitacionCallback";
    s.onerror = () => { mensaje.textContent = "No pudimos conectar con GLAM."; };
    document.body.appendChild(s);
}

/* ===== RSVP ===== */
function configurarFormulario() {
    const form = $("formularioRSVP");
    const selAsistencia = $("asistencia"), bloque = $("datosAsistencia");

    selAsistencia.addEventListener("change", () => {
        bloque.style.display = selAsistencia.value === "NO" ? "none" : "flex";
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const boton = form.querySelector("button[type=submit]");
        const mensaje = $("mensajeRSVP");
        const invitado = window.glamInvitadoActual;
        const token = tokenURL();

        if (!invitado || !token) {
            mensaje.textContent = "No se pudo identificar tu invitación.";
            return;
        }

        const asistencia = selAsistencia.value;
        if (!asistencia) {
            mensaje.textContent = "Selecciona si podrás acompañarnos.";
            return;
        }

        const cantidad = asistencia === "SI" ? Number($("cantidadPases").value) : 0;
        const acompanantes = asistencia === "SI" ? $("acompanantes").value.trim() : "";

        if (asistencia === "SI" && (!cantidad || cantidad > Number(invitado.invitado.pasesAsignados))) {
            mensaje.textContent = "La cantidad de personas supera los pases asignados.";
            return;
        }

        boton.disabled = true;
        boton.textContent = "Enviando confirmación...";

        try {
            await fetch(DATOS_BODA.rsvpEndpoint, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ token, asistencia, cantidadPases: cantidad, acompanantes })
            });

            mensaje.textContent = "¡Gracias! Tu respuesta fue enviada correctamente.";
            invitado.invitado.estadoRSVP = asistencia === "SI" ? "CONFIRMADO" : "NO ASISTIRÁ";
            invitado.invitado.pasesConfirmados = cantidad;
            invitado.invitado.acompanantes = acompanantes;
        } catch (err) {
            mensaje.textContent = "No pudimos enviar tu respuesta. Inténtalo nuevamente.";
        }

        boton.disabled = false;
        boton.innerHTML = 'Confirmar asistencia <span>♥</span>';
    });
}

/* ===== QR ===== */
function generarQR() {
    const cont = $("codigoQR");
    if (typeof QRCode === "undefined") {
        cont.textContent = DATOS_BODA.codigoInvitacion;
        return;
    }
    new QRCode(cont, {
        text: DATOS_BODA.codigoInvitacion,
        width: 150,
        height: 150,
        colorDark: "#1c2638",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

/* ===== ANIMACIONES ===== */
function configurarAnimaciones() {
    const els = document.querySelectorAll(".seccion, .evento-itinerario, .ubicacion-tarjeta, .regalo-item");

    const obs = new IntersectionObserver((entradas, o) => {
        entradas.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add("visible");
                o.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => {
        if (el.dataset.observado) return;
        el.dataset.observado = "1";
        el.classList.add("revelar");
        obs.observe(el);
    });
}

/* ===== ÁLBUM: SUBIR FOTOS ===== */
function configurarCargaFotosGLAM() {
    const selector = $("seleccionarFotos"), boton = $("botonEnviarFotos");
    const vista = $("vistaPreviaFotos"), mensaje = $("mensajeFotos");
    if (!selector || !boton || !vista || !mensaje) return;

    const token = tokenURL(), endpoint = DATOS_BODA.rsvpEndpoint;
    let fotos = [];

    if (!token || !endpoint) {
        mensaje.textContent = "Abre tu enlace personal para compartir fotografías.";
        selector.disabled = true;
        return;
    }

    selector.addEventListener("change", () => {
        fotos = Array.from(selector.files || []);
        vista.innerHTML = "";

        if (fotos.length > 5) {
            mensaje.textContent = "Puedes seleccionar hasta 5 fotografías por envío.";
            fotos = [];
            selector.value = "";
            boton.disabled = true;
            return;
        }

        fotos.forEach(f => {
            const im = document.createElement("img");
            im.src = URL.createObjectURL(f);
            vista.appendChild(im);
        });

        boton.disabled = fotos.length === 0;
        mensaje.textContent = fotos.length + " fotografía(s) seleccionada(s).";
    });

    boton.addEventListener("click", async () => {
        if (!fotos.length) return;
        boton.disabled = true;
        selector.disabled = true;

        try {
            for (let i = 0; i < fotos.length; i++) {
                mensaje.textContent = `Enviando fotografía ${i + 1} de ${fotos.length}...`;
                const reducida = await reducirFotoGLAM(fotos[i]);

                await fetch(endpoint, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({
                        tipo: "subir_foto",
                        token,
                        nombreArchivo: fotos[i].name,
                        tipoMime: "image/jpeg",
                        base64: reducida.split(",")[1]
                    })
                });
            }
            mensaje.textContent = "¡Gracias por compartir tus recuerdos! Hemos enviado tus fotografías.";
            fotos = [];
            selector.value = "";
            vista.innerHTML = "";
        } catch (e) {
            console.error(e);
            mensaje.textContent = "No se pudieron enviar las fotografías. Inténtalo nuevamente.";
        }

        selector.disabled = false;
        boton.disabled = true;
    });
}

function reducirFotoGLAM(archivo) {
    return new Promise((resolve, reject) => {
        const img = new Image(), lector = new FileReader();

        lector.onload = ev => {
            img.onload = () => {
                const max = 1600;
                let w = img.width, h = img.height;

                if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
                else if (h > max) { w = Math.round(w * max / h); h = max; }

                const c = document.createElement("canvas");
                c.width = w;
                c.height = h;
                c.getContext("2d").drawImage(img, 0, 0, w, h);
                resolve(c.toDataURL("image/jpeg", 0.75));
            };
            img.onerror = reject;
            img.src = ev.target.result;
        };
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

/* ===== ÁLBUM: GALERÍA PÚBLICA ===== */
function cargarGaleriaPublicaGLAM() {
    const cont = $("galeriaPublicaGLAM");
    const token = tokenURL(), endpoint = DATOS_BODA.rsvpEndpoint;
    if (!token || !endpoint || !cont) return;

    cont.innerHTML = "<p>Cargando recuerdos...</p>";
    const cb = "glamGaleriaCallback";

    window[cb] = respuesta => {
        delete window[cb];

        if (!respuesta || !respuesta.correcto) {
            cont.innerHTML = "<p>No se pudieron cargar los recuerdos.</p>";
            return;
        }

        const fotos = respuesta.fotografias || [];
        if (!fotos.length) {
            cont.innerHTML = "<p>Pronto aparecerán aquí los recuerdos compartidos.</p>";
            return;
        }

        cont.innerHTML = "";
        fotos.forEach((foto, i) => {
            const im = document.createElement("img");
            im.src = "data:" + foto.tipoMime + ";base64," + foto.base64;
            im.alt = foto.nombre || "Recuerdo compartido";
            im.addEventListener("click", () => abrirVisorVintageGLAM(fotos, i));
            cont.appendChild(im);
        });
    };

    const s = document.createElement("script");
    const sep = endpoint.includes("?") ? "&" : "?";
    s.src = endpoint + sep + "galeria=1&token=" + encodeURIComponent(token) + "&callback=" + cb;
    s.onerror = () => {
        cont.innerHTML = "<p>No se pudo conectar con el álbum.</p>";
        delete window[cb];
    };
    document.body.appendChild(s);
}

/* ===== VISOR CON NAVEGACIÓN ===== */
let fotosVisor = [], indiceVisor = 0;

function abrirVisorVintageGLAM(fotos, indice) {
    fotosVisor = fotos;
    indiceVisor = indice;

    const visor = $("visorFotos"), ampliada = $("imagenAmpliada");
    if (!visor || !ampliada) return;

    let nav = visor.querySelector(".navegacion-vintage");
    if (!nav) {
        nav = document.createElement("div");
        nav.className = "navegacion-vintage";
        nav.innerHTML = `
            <button type="button" class="anterior-vintage" aria-label="Anterior">‹</button>
            <button type="button" class="siguiente-vintage" aria-label="Siguiente">›</button>`;
        visor.appendChild(nav);

        nav.querySelector(".anterior-vintage").addEventListener("click", e => { e.stopPropagation(); cambiarFotoVisor(-1); });
        nav.querySelector(".siguiente-vintage").addEventListener("click", e => { e.stopPropagation(); cambiarFotoVisor(1); });
    }
    nav.style.display = "block";

    let cont = visor.querySelector(".contador-vintage");
    if (!cont) {
        cont = document.createElement("div");
        cont.className = "contador-vintage";
        visor.appendChild(cont);
    }
    cont.style.display = "block";

    if (!ampliada.dataset.gestos) {
        let x0 = 0, y0 = 0;
        ampliada.addEventListener("touchstart", e => {
            x0 = e.changedTouches[0].screenX;
            y0 = e.changedTouches[0].screenY;
        }, { passive: true });
        ampliada.addEventListener("touchend", e => {
            const dx = e.changedTouches[0].screenX - x0;
            const dy = e.changedTouches[0].screenY - y0;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) cambiarFotoVisor(dx < 0 ? 1 : -1);
        }, { passive: true });
        ampliada.dataset.gestos = "1";
    }

    mostrarFotoVisor();
    visor.classList.add("visible");
}

function mostrarFotoVisor() {
    const ampliada = $("imagenAmpliada"), visor = $("visorFotos");
    if (!ampliada || !fotosVisor.length) return;

    const f = fotosVisor[indiceVisor];
    ampliada.src = "data:" + f.tipoMime + ";base64," + f.base64;
    ampliada.alt = f.nombre || "Recuerdo compartido";

    const c = visor.querySelector(".contador-vintage");
    if (c) c.textContent = (indiceVisor + 1) + " / " + fotosVisor.length;
}

function cambiarFotoVisor(dir) {
    if (!fotosVisor.length) return;
    indiceVisor = (indiceVisor + dir + fotosVisor.length) % fotosVisor.length;
    mostrarFotoVisor();
}

/* ===== CAPA 2 · EFECTOS VISUALES ===== */
document.addEventListener("DOMContentLoaded", () => {

    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inv = document.getElementById("invitacion");

    // Barra de progreso
    const barra = document.createElement("div");
    barra.id = "progreso";
    document.body.appendChild(barra);

    // Pétalos
    const capa = document.createElement("div");
    capa.id = "petalos";
    const colores = ["#f4d9d3", "#ead2cc", "#f2e2bf", "#e6d3a3", "#ffffff"];

    for (let i = 0; i < (reducido ? 0 : 16); i++) {
        const p = document.createElement("span");
        p.className = "petalo";
        p.style.cssText =
            `left:${Math.random() * 100}%;` +
            `--t:${8 + Math.random() * 10}px;` +
            `--c:${colores[i % colores.length]};` +
            `--d:${12 + Math.random() * 12}s;` +
            `--r:-${Math.random() * 20}s;` +
            `--x:${(Math.random() - .5) * 160}px`;
        capa.appendChild(p);
    }
    document.body.appendChild(capa);

    if (inv) {
        const activar = () => {
            if (!inv.classList.contains("oculto")) capa.classList.add("activo");
        };
        new MutationObserver(activar).observe(inv, {
            attributes: true,
            attributeFilter: ["class", "style"]
        });
    }

    // Cinta dorada con nombres y fecha
    const historia = document.getElementById("historia");
    if (historia && typeof DATOS_BODA !== "undefined") {
        const n = DATOS_BODA.nombres;
        const f = new Date(DATOS_BODA.fecha);
        const item =
            `<span>${n.primero} ♥ ${n.segundo}</span><span>✦</span>` +
            `<span>${f.getDate()} · ${f.getMonth() + 1} · ${f.getFullYear()}</span><span>✦</span>`;

        const cinta = document.createElement("div");
        cinta.className = "cinta";
        cinta.innerHTML = `<div class="cinta-pista">${item.repeat(8)}</div>`;
        historia.parentNode.insertBefore(cinta, historia);
    }

    // Progreso y parallax
    const portada = document.querySelector(".portada");
    let pendiente = false;

    addEventListener("scroll", () => {
        if (pendiente) return;
        pendiente = true;

        requestAnimationFrame(() => {
            const y = scrollY;
            const max = document.documentElement.scrollHeight - innerHeight;
            barra.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

            if (portada && !reducido && y < innerHeight * 1.3) {
                portada.style.setProperty("--py", Math.min(y * .25, 120));
            }
            pendiente = false;
        });
    }, { passive: true });
});
