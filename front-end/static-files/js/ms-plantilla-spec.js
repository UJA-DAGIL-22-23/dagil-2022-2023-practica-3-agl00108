/**
 * @file ms-plantilla-spec.js
 * @description Fichero TDD para probar todo lo relacionado con MS Plantilla en el front-end
 * @author Alba G. Liébana <agl00108@readonly.ujaen.es>
 * @date 03-feb-2023
 */

// SPECS para Jasmine

// Constantes para usar en las pruebas
const elementoTitulo = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO)
const elementoContenido = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO)
const TITULO_HOME = "Plantilla Home"
const TITULO_ACERCA_DE = "Plantilla Acerca de"

const datosDescargadosPrueba = 
{
    mensaje: "Mensaje de prueba descargado",
    autor: "Prueba de autor",
    email: "Prueba de email",
    fecha: "00/00/0000"
}

// Función para esperar y dar tiempo a que responda el microservicio
function esperar(ms) {
    var inicio = new Date().getTime();
    var fin = 0;
    while ((fin - inicio) < ms) {
        fin = new Date().getTime();
    }
}

// SPECS a probar

describe("Plantilla.mostrarHome: ", function () {

    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarHome()
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarHome(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje",
        function () {
            // Objeto vacío
            Plantilla.mostrarHome({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)

            // Objeto sin campo mensaje
            Plantilla.mostrarHome({ foo: "bar" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra correctamente el título y el mensaje",
        function () {
            Plantilla.mostrarHome(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(datosDescargadosPrueba.mensaje)
        })
})


describe("Plantilla.mostrarAcercaDe: ", function () {
    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarAcercaDe()
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarAcercaDe(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje o autor o email o fecha ",
        function () 
        {
            // Objeto vacío
            Plantilla.mostrarAcercaDe({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()

            // Objeto sin campo mensaje
            Plantilla.mostrarAcercaDe({ autor: "un autor", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo autor
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo email
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo fecha
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", email: "un email" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })
    it("muestra correctamente el título y el mensaje conteniendo el autor, el email y la fecha",
        function () {
            Plantilla.mostrarAcercaDe(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)

            // Comprobamos que al buscar el autor, el email y la fecha de prueba los encuentra dentro del contenido del article
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.autor) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.email) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.fecha) >= 0).toBeTrue()
        })
})

describe("Cabecera tabla ", function () 
{
    it("debería devolver las etiquetas HTML para la cabecera de la tabla",
        function () {
            expect(Plantilla.cabeceraTableNombre()).toBe(`<table class="listado-nombres"><thead><th>Nombre del deportista</th></thead><tbody>`);
        });
});

describe("cuerpo con los nombres ", function () 
{
    // Preparo los datos
    let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "Id de Luis"
                        }
                    },
                    data: {
                        nombre: "Luis"
                    }
                },
                {
                    ref: {
                        "@ref": {
                            id: "Id de Ana"
                        }
                    },
                    data: {
                        nombre: "Ana"
                    }
                }
            ]

    // Realizo los expect
    it("debería devolver una fila de tabla con los nombres de los deportistas",
        function () {
            for (let i = 0; i < vector.data.length; ++i) 
            {
                let msj = Plantilla.cuerpoTrNombre(vector.data[i])
                let persona = vector.data[i]
                expect(msj.includes(persona.ref["@ref"].id)).toBeTrue();
                expect(msj.includes(persona.data.nombre)).toBeTrue();
            }
        });
    });

describe("Pie tabla ", function () 
{
    it("debería devolver las etiquetas HTML para el pie de tabla",
        function () {
            expect(Plantilla.pieTableNombre()).toBe("</tbody></table>");
        });
});

describe("Plantilla.imprimeDeportistas: ", function () 
    {
        it("Observa si los nombres se muestran",
        function () {
            //Primero preparamos unos datos estáticos
            let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "Id de Luis"
                        }
                    },
                    data: {
                        nombre: "Luis"
                    }
                },
                {
                    ref: {
                        "@ref": {
                            id: "Id de Ana"
                        }
                    },
                    data: {
                        nombre: "Ana"
                    }
                }
            ]
            Plantilla.imprimeDeportistas(vector)
            // Compruebo que en el primer TD De la tabla se ha escrito Ana
            expect(elementoContenido.getElementsByTagName("td")[0].innerText.search('Luis') >= 0).toBeTrue()
            expect(elementoContenido.getElementsByTagName("td")[0].innerText.includes('Luis')).toBeTrue()
        })
    })

    describe("Plantilla.imprimeDeportistasAlf: ", function () 
    {
        it("Observa si los nombres se ordenan alfabéticamente",
        function () {
            let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "Id de Luis"
                        }
                    },
                    data: {
                        nombre: "Luis"
                    }
                },
                {
                    ref: {
                        "@ref": {
                            id: "Id de Ana"
                        }
                    },
                    data: {
                        nombre: "Ana"
                    }
                }
            ]
            Plantilla.imprimeDeportistasAlf(vector)
            // Compruebo que en el primer TD De la tabla se ha escrito Ana
            //expect(elementoContenido.getElementsByTagName("td")[0].innerText.search('Pepito') >= 0).toBeTrue()
            expect(elementoContenido.getElementsByTagName("td")[0].innerText.includes('Ana')).toBeTrue()

        })
    })

    describe("Cabecera tabla de todos los datos", function () 
    {
        it("debería devolver las etiquetas HTML para la cabecera de la tabla",
            function () {
                expect(Plantilla.cabeceraTable()).toBe(`<table class="listado-deportistas"><thead><th>Nombre</th><th>Apellidos</th><th>País</th><th>Categoría</th><th>Sexo</th><th>Fecha nacimiento</th><th>Medallas ganadas</th><th>Años participación</th><th>Logros</th></thead><tbody>`);
            });
    });

    describe("Cuerpo con todos los datos de los deportistas", function () 
    {
        // Preparo los datos
        let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "ref persona 1"
                        }
                    },
                    data: {
                        nombre: "Lidia",
                        apellidos: "Valentin Perez",
                        fechaNacimiento: {
                            dia: 13,
                            mes: 5,
                            anio: 1985
                        },
                        aniosParticipacionOlimpiadas: [2008, 2012, 2016, 2020],
                        numMedallasGanadas: 3,
                        logros: [
                            "Plata en Beijing 2008",
                            "Oro en Londres 2012",
                            "Bronce en Río 2016"
                        ],
                        pais: "Spain",
                        categoria: "Heavyweight",
                        sexo: "F"
                    }
                },
                {
                    ref: {
                        "@ref": {
                            id: "ref persona 2"
                        }
                    },
                    data: {
                        nombre: "Shi",
                        apellidos: "Zhiyong",
                        fechaNacimiento: {
                            dia: 3,
                            mes: 4,
                            anio: 1993
                        },
                        aniosParticipacionOlimpiadas: [2016, 2020],
                        numMedallasGanadas: 2,
                        logros: ["Oro en Río 2016", "Oro en Tokio 2020"],
                        pais: "China",
                        categoria: "Lightweight",
                        sexo: "M"
                    }
                }
            ]   
        // Realizo los expect
        it("debería devolver una fila de tabla con los datos de los deportistas",
        function () 
        {
            for (let i = 0; i < vector.data.length; ++i) 
            {
                let msj = Plantilla.cuerpoTr(vector.data[i])
                let persona = vector.data[i]
                const fecha = new Date(persona.data.fechaNacimiento.anio, persona.data.fechaNacimiento.mes - 1, persona.data.fechaNacimiento.dia);
                const fechaFormateada = fecha.toLocaleDateString();
                expect(msj.includes(persona.ref["@ref"].id)).toBeTrue();
                expect(msj.includes(persona.data.nombre)).toBeTrue();
                expect(msj.includes(persona.data.apellidos)).toBeTrue();
                expect(msj.includes(fechaFormateada)).toBeTrue();
                expect(msj.includes(persona.data.aniosParticipacionOlimpiadas)).toBeTrue();
                expect(msj.includes(persona.data.numMedallasGanadas)).toBeTrue();
                expect(msj.includes(persona.data.logros)).toBeTrue();
                expect(msj.includes(persona.data.pais)).toBeTrue();
                expect(msj.includes(persona.data.categoria)).toBeTrue();
                expect(msj.includes(persona.data.sexo)).toBeTrue();
            }
        });
    });

    describe("Pie tabla ", function () 
    {
        it("debería devolver las etiquetas HTML para el pie de tabla",
            function () {
                expect(Plantilla.pieTableNombre()).toBe("</tbody></table>");
            });
    });

    describe("Plantilla.imprimeCompleto: ", function () 
    {
        it("Observa si los datos se muestran",
        function () {
            //Primero preparamos unos datos estáticos
            let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "ref persona 1"
                        }
                    },
                    data: {
                        nombre: "Lidia",
                        apellidos: "Valentin Perez",
                        fechaNacimiento: {
                            dia: 13,
                            mes: 5,
                            anio: 1985
                        },
                        aniosParticipacionOlimpiadas: [2008, 2012, 2016, 2020],
                        numMedallasGanadas: 3,
                        logros: [
                            "Plata en Beijing 2008",
                            "Oro en Londres 2012",
                            "Bronce en Río 2016"
                        ],
                        pais: "Spain",
                        categoria: "Heavyweight",
                        sexo: "F"
                    }
                }
            ]   
            Plantilla.imprimeCompleto(vector)
            // Compruebo que en el primer TD De la tabla se ha escrito bien a Lidia
            expect(elementoContenido.getElementsByTagName("td")[0].innerText.includes('Lidia')).toBeTrue()
        })
    })

    describe("Plantilla.imprimeDeportista: ", function () 
    {
        it("Observa si los datos se muestran",
        function () {
            //Primero preparamos unos datos estáticos
            let vector = {}
            vector.data = [
                {
                    ref: {
                        "@ref": {
                            id: "ref persona 1"
                        }
                    },
                    data: {
                        nombre: "Lidia",
                        apellidos: "Valentin Perez",
                        fechaNacimiento: {
                            dia: 13,
                            mes: 5,
                            anio: 1985
                        },
                        aniosParticipacionOlimpiadas: [2008, 2012, 2016, 2020],
                        numMedallasGanadas: 3,
                        logros: [
                            "Plata en Beijing 2008",
                            "Oro en Londres 2012",
                            "Bronce en Río 2016"
                        ],
                        pais: "Spain",
                        categoria: "Heavyweight",
                        sexo: "F"
                    }
                }
            ]   
            Plantilla.imprimeDeportista(vector.data[0])
            // Compruebo que se ha escrito bien a Lidia
            expect(elementoContenido.getElementsByTagName("td")[0].innerText.includes('Lidia')).toBeTrue()
        })
    })


    
/*
IMPORTANTE
==========

Las pruebas TDD que se encargan de probar las conexiones con el microservicio desde el cliente son difíciles de probar 
dado que requieren solucionar temas de sincronización. 
Esto afecta a los métodos:
 - Plantilla.descargarRuta
 - Plantilla.procesarAcercaDe
 - Plantilla.procesarHome

 Las soluciones propuestas en distintos sitios web no han producido el resultado esperado, 
 por tanto: para esta práctica, se pueden dejar SIN HACER.

 */
