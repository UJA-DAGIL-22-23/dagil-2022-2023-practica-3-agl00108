/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Alba G. Liébana <agl00108@red.ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = 
{
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}

//Para formulario del campo a ordenar de los deportistas
const enlaceMostrarFormulario = document.querySelector('#enlace-formulario');
const formulario = document.querySelector('#formulario');
const botonListar = document.querySelector('#boton-listar');

enlaceMostrarFormulario.addEventListener('click', function(event) 
{
  event.preventDefault();
  formulario.style.display = 'block';
});

botonListar.addEventListener('click', function(event) 
{
  event.preventDefault();
  const campo = document.querySelector('#campo').value;
  Plantilla.listarCompletoT(campo);
});

//PARA CREAR LA TABLA DE NOMBRES
/**
 * Crea la cabecera para mostrar la info como tabla de los nombres de los deportistas
 * @returns Cabecera de la tabla 
 */
Plantilla.cabeceraTableNombre = function () 
{
    return `<table class="listado-nombres"><thead><th>Nombre del deportista</th></thead><tbody>`;
}

/**
 * Muestra el nombre de cada deportista en un elemento TR con sus correspondientes TD
 * @param {deportista} p Datos del deportista a mostrar con los nombres de los deportistas
 * @returns Cadena conteniendo todo el elemento TR que muestra los nombres.
 */
Plantilla.cuerpoTrNombre = function (p) 
{
    const d = p.data

    return `<tr title="${p.ref['@ref'].id}">
    <td><em>${d.nombre}</em></td>
    </tr>
    `;
}

/**
 * Muestra el pie de tabla de los nombres de los deportistas
 * @returns Cadena conteniendo el pie de tabla
 */
Plantilla.pieTableNombre = function () 
{
    return "</tbody></table>";
}

//PARA TABLA DE LOS DEPORTISTAS CON TODOS LOS DATOS
/**
 * Crea la cabecera para mostrar la info como tabla de los nombres de los deportistas
 * @returns Cabecera de la tabla 
 */
Plantilla.cabeceraTable = function () 
{
    return `<table class="listado-deportistas"><thead><th>Nombre</th><th>Apellidos</th><th>País</th><th>Categoría</th><th>Sexo</th><th>Fecha nacimiento</th><th>Medallas ganadas</th><th>Años participación</th><th>Logros</th></thead><tbody>`;
}

/**
 * Muestra la información de cada deportista en un elemento TR con sus correspondientes TD
 * @param {deportista} p Datos del deportista a mostrar con sus datos
 * @returns Cadena conteniendo todo el elemento TR que muestra el deportista.
 */
Plantilla.cuerpoTr = function (p) 
{
    const d = p.data
        const fecha = new Date(d.fechaNacimiento.anio, d.fechaNacimiento.mes - 1, d.fechaNacimiento.dia);
        const fechaFormateada = fecha.toLocaleDateString();
    return `<tr title="${p.ref['@ref'].id}">
        <td>${d.nombre}</td>
        <td>${d.apellidos}</td>
        <td>${d.pais}</td>
        <td>${d.categoria}</td>
        <td>${d.sexo}</td>
        <td>${fechaFormateada}</td>
        <td>${d.numMedallasGanadas}</td>
        <td>${d.aniosParticipacionOlimpiadas}</td>
        <td>${d.logros}</td>
    </tr>`;
}

/**
 * Muestra el pie de tabla de los nombres de los deportistas
 * @returns Cadena conteniendo el pie de tabla
 */
Plantilla.pieTable = function () 
{
    return "</tbody></table>";
}




//PARA DESCARGAR LAS DIFERENTES RUTAS
/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) 
{
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}

/**
 * Función que recupera un deportista por su id
 * @param {String} idDeportista id del deportista a mostrar
 * @param {*} callBackFn función llamada cuando se reciban los datos
 */
Plantilla.recuperaDeportista=async function(idDeportista, callBackFn)
{
    try
    {
        const url=Frontend.API_GATEWAY+"/plantilla/getPorId/"+idDeportista
        const response = await fetch(url);
        if(response)
        {
            const deportista=await response.json()
            callBackFn(deportista)
        }
    }catch(error)
    {
        alert("Error: No se ha podido acceder al API Gateway")
        console.error(error)
    }
}

/**
 * Función que recupera todos los deportistas y llama a campo
 * @param {String} idDeportista id del deportista a mostrar
 * @param {*} callBackFn función llamada cuando se reciban los datos
 */
Plantilla.recuperaDeportistas=async function(campoOrden, callBackFn)
{
    try
    {
        const url=Frontend.API_GATEWAY+"/plantilla/getTodas"
        const response = await fetch(url);
        if(response)
        {
            const deportistas=await response.json()
            callBackFn(campoOrden,deportistas)
        }
    }catch(error)
    {
        alert("Error: No se ha podido acceder al API Gateway")
        console.error(error)
    }
}

//PARA MOSTRAR LOS DATOS ENVIADOS DESDE HOME
/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) 
{
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

//PARA MOSTRAR LOS DATOS DE ACERCA DE
/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) 
{
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

//FUNCIONES CREADAS PARA FUNCIONALIDADES
/**
 * Función para mostrar en pantalla todas los deportistas que se han recuperado de la BBDD.
 * @param {Vector_de_deportistas} vector Vector con los datos de los deportistas a mostrar
 */
Plantilla.imprimeDeportistas = function (vector) 
{

    let msj = "";
    msj += Plantilla.cabeceraTableNombre();
    vector.data.forEach(e => msj += Plantilla.cuerpoTrNombre(e))
    msj += Plantilla.pieTableNombre();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de los nombres de los deportistas", msj )
}

/**
 * Función para mostrar en pantalla todas los deportistas que se han recuperado de la BBDD alfabétiamente.
 * @param {Vector_de_deportistas} vector Vector con los datos de los deportistas a mostrar
 */
Plantilla.imprimeDeportistasAlf = function (vector) 
{
    let msj = "";
    msj += Plantilla.cabeceraTableNombre();
    let ordenados=vector.data.sort((a, b) => a.data.nombre<b.data.nombre?-1:1); // ordena los elementos por el campo "nombre"
    ordenados.forEach(e => msj += Plantilla.cuerpoTrNombre(e));
    msj += Plantilla.pieTableNombre();
  
    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Listado de los nombres de los deportistas ordenados alfabéticamente", msj);
}

/**
 * Función para mostrar en pantalla todos los datos de los deportistas que se han recuperado de la BBDD
 * @param {Vector_de_deportistas} vector Vector con los datos de los deportistas a mostrar
 */
Plantilla.imprimeCompleto = function (vector) 
{
    let msj = "";
    msj += Plantilla.cabeceraTable();
    vector.data.forEach(e => msj += Plantilla.cuerpoTr(e))
    msj += Plantilla.pieTable();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de deportistas completo", msj )
}

/**
 * Función para mostrar en pantalla todos los datos de los deportistas que se han recuperado de la BBDD
 * @param {Deportista} deportistaUnico con los datos de los deportistas a mostrar
 */
Plantilla.imprimeDeportista = function (deportistaUnico) 
{
    let msj = "";
    msj += Plantilla.cabeceraTable();
    msj += Plantilla.cuerpoTr(deportistaUnico)
    msj += Plantilla.pieTable();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Datos del deportista solicitado", msj )
}

/**
 * Función para mostrar en pantalla todos los datos de los deportistas que se han recuperado de la BBDD
 * @param {Vector_de_deportistas} vector Vector con los datos de los deportistas a mostrar
 */
Plantilla.imprimePorCampo = function (campoOrden,vector) 
{
    let msj = "";
    msj += Plantilla.cabeceraTable();
    
    let ordenados = vector.data.sort((a, b) => 
    {
        if (campoOrden === "fechaNacimiento") {
          const fechaA = new Date(a.data.fechaNacimiento.anio, a.data.fechaNacimiento.mes - 1, a.data.fechaNacimiento.dia);
          const fechaB = new Date(b.data.fechaNacimiento.anio, b.data.fechaNacimiento.mes - 1, b.data.fechaNacimiento.dia);
          return fechaA < fechaB ? -1 : 1;
        } else if(campoOrden === "numMedallasGanadas") {
          return a.data[campoOrden] > b.data[campoOrden] ? -1 : 1;
        } else {
            return a.data[campoOrden] < b.data[campoOrden] ? -1 : 1;
        }
      });
  
    ordenados.forEach(e => msj += Plantilla.cuerpoTr(e));
    msj += Plantilla.pieTable();
  
    Frontend.Article.actualizar("Listado de deportistas completo ordenado ", msj);
  }

  Plantilla.modificarNombre = function (deportista) 
    { 
        let msj=`<form method='post' action=''>
        <table width="100%" class="listado-personas">
            <thead>
            <table class="listado-deportistas"><thead><th>Nombre</th><th>Apellidos</th><th>País</th><th>Categoría</th><th>Sexo</th><th>Fecha nacimiento</th><th>Medallas ganadas</th><th>Años participación</th><th>Logros</th></thead><tbody>
            </thead>
            <tbody>
                <tr title="${deportista.ref["@ref"].id}">
                    <td><input type="text" class="form-persona-elemento" id="deportista-nombre"
                            value="${deportista.data.nombre}" name="nombre_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-apellidos" required value="${deportista.data.apellidos}" name="apellidos_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-pais" required value="${deportista.data.pais}" name="pais_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-categoria" required value="${deportista.data.categoria}" name="categoria_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-sexo" required value="${deportista.data.sexo}" name="sexo_deportista"/>
                    </td>
                    <td><input type="date" class="form-persona-elemento editable" disabled
                            id="deportista_fechaNacimiento" value="${deportista.data.fechaNacimiento.dia}/${deportista.data.fechaNacimiento.mes}/${deportista.data.fechaNacimiento.anio}" 
                            name="fechaNacimiento_deportista"/>
                    </td>
                    <td><input type="number" class="form-persona-elemento editable" disabled
                            id="deportista-numMedallasGanadas" required value="${deportista.data.numMedallasGanadas}" name="numMedallasGanadas_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-aniosParticipacionOlimpiadas" required value="${deportista.data.aniosParticipacionOlimpiadas}" name="aniosParticipacionOlimpiadas_deportista"/>
                    </td>
                    <td><input type="text" class="form-persona-elemento editable" disabled
                            id="deportista-logros" required value="${deportista.data.logros}" name="logros_deportista"/>
                    </td>
                            
                        <div><a href="javascript:Plantilla.guardar('358470619171389645')">Guardar</a></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
    `;
    Frontend.Article.actualizar("Modifica el nombre del deportista",msj)
}

Plantilla.modificarCampos = function (deportista) 
{ 
    let msj=`<form method='post' action=''>
    <table width="100%" class="listado-personas">
        <thead>
        <table class="listado-deportistas"><thead><th>Nombre</th><th>Apellidos</th><th>País</th><th>Categoría</th><th>Sexo</th><th>Fecha nacimiento</th><th>Medallas ganadas</th><th>Años participación</th><th>Logros</th></thead><tbody>
        </thead>
        <tbody>
            <tr title="${deportista.ref["@ref"].id}">
                <td><input type="text" class="form-persona-elemento" id="deportista-nombre"
                        value="${deportista.data.nombre}" name="nombre_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" 
                        id="deportista-apellidos" required value="${deportista.data.apellidos}" name="apellidos_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" 
                        id="deportista-pais" required value="${deportista.data.pais}" name="pais_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" 
                        id="deportista-categoria" required value="${deportista.data.categoria}" name="categoria_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" disabled
                        id="deportista-sexo" required value="${deportista.data.sexo}" name="sexo_deportista"/>
                </td>
                <td><input type="date" class="form-persona-elemento editable" disabled
                        id="deportista_fechaNacimiento" value="${deportista.data.fechaNacimiento.dia}/${deportista.data.fechaNacimiento.mes}/${deportista.data.fechaNacimiento.anio}" 
                        name="fechaNacimiento_deportista"/>
                </td>
                <td><input type="number" class="form-persona-elemento editable" disabled
                        id="deportista-numMedallasGanadas" required value="${deportista.data.numMedallasGanadas}" name="numMedallasGanadas_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" disabled
                        id="deportista-aniosParticipacionOlimpiadas" required value="${deportista.data.aniosParticipacionOlimpiadas}" name="aniosParticipacionOlimpiadas_deportista"/>
                </td>
                <td><input type="text" class="form-persona-elemento editable" disabled
                        id="deportista-logros" required value="${deportista.data.logros}" name="logros_deportista"/>
                </td>
                        
                    <div><a href="javascript:Plantilla.guardar('358470619171389645')">Guardar</a></div>
                </td>
            </tr>
        </tbody>
    </table>
</form>
`;
Frontend.Article.actualizar("Modifica los campos del deportista",msj)
}


//FUNCIONES PRINCIPALES 
/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () 
{
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () 
{
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimirlas.
 */
Plantilla.listar=function()
{
    this.descargarRuta("/plantilla/getTodas",this.imprimeDeportistas);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimirlas ordenados alfabéticamente.
 */
Plantilla.listarAlf=function()
{
    this.descargarRuta("/plantilla/getTodas",this.imprimeDeportistasAlf);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimir todos los datos.
 */
Plantilla.listarCompleto=function()
{
    this.descargarRuta("/plantilla/getTodas",this.imprimeCompleto);
}

/**
 * Función principal para mostrar los datos de un deportista desde el MS e imprimirlo
 * @param {String} idDeportista id del deportista a mostrar
 */
Plantilla.mostrarDeportista = function (idDeportista) 
{
    this.recuperaDeportista(idDeportista,this.imprimeDeportista);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimir todos los datos ordenados por un campo.
 * @param {String} campoOrdenar campo por el que se pretenden ordenar los deportistas
 */
Plantilla.listarCompletoT = function(campoOrdenar)
{
    this.recuperaDeportistas(campoOrdenar,this.imprimePorCampo);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimir todos los datos ordenados por un campo.
 * @param {String} campoOrdenar campo por el que se pretenden ordenar los deportistas
 */
Plantilla.modifyNombre = function(idDeportista)
{
    this.recuperaDeportista(idDeportista,this.modificarNombre);
}

/**
 * Función principal para recuperar los deportistas desde el MS y, posteriormente, imprimir todos los datos ordenados por un campo.
 * @param {String} campoOrdenar campo por el que se pretenden ordenar los deportistas
 */
Plantilla.modifyCampos = function(idDeportista)
{
    this.recuperaDeportista(idDeportista,this.modificarCampos);
}

/**
 * Función para guardar los datos de un deportista al que se le va a cambiar el nombre
 */
Plantilla.guardar = async function (id_deportista) 
{
    try {
        let url = Frontend.API_GATEWAY + "/plantilla/setCampos/"
        let id = id_deportista
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({
                "id_deportista": id,
                "nombre_deportista": document.getElementById("deportista-nombre").value,
                "apellidos_deportista": document.getElementById("deportista-apellidos").value,
                "pais_deportista": document.getElementById("deportista-pais").value,
                "categoria_deportista": document.getElementById("deportista-categoria").value,
            }),
        })
        /*
        Error: No procesa bien la respuesta devuelta
        if (response) {
            const persona = await response.json()
            alert(persona)
        }
        */
        Plantilla.mostrarDeportista(id_deportista)
    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway " + error)
    }
}
