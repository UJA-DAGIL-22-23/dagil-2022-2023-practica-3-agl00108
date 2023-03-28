/**
 * @file server-spec.js
 * @description Fichero con la especificación de las pruebas TDD para server.js del MS MS Plantilla
 *              Este fichero DEBE llamarse server-spec.js
 *              Este fichero DEBE ubicarse en el subdirectorio spec/
 * @author Alba Gómez Liébana <agl00108@red.ujaen.es>
 * @date 03-Feb-2023
 */


const supertest = require('supertest');
const assert = require('assert')
const app = require('../server');

/**
 * Test para las rutas "estáticas": / y /acerdade
 */
describe('Servidor PLANTILLA:', () => {
  describe('Rutas / y /acercade', () => {
    it('Devuelve MS Plantilla Home Page', (done) => {
      supertest(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: home");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve MS Plantilla Acerca De', (done) => {
      supertest(app)
        .get('/acercade')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( "BODY ACERCA DE ", res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Datos de la autora");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
  })

  /**
   * Tests para acceso a la BBDD
   */
  describe('Acceso a BBDD:', () => {
    it('Devuelve Valentin Perez al consultar mediante test_db', (done) => {
      supertest(app)
        .get('/test_db')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert(res.body.data[0].data.hasOwnProperty('apellidos'));
          assert(res.body.data[0].data.apellidos === "Valentin Perez");

        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });
  })

  it('Devuelve un vector de tamaño 10 al consultar mediante getTodas', (done) => {
    supertest(app)
      .get('/getTodas')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert(res.body.data.length === 10);
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });

  it('Devuelve Heavyweight al recuperar los datos de la Persona con id 358470619171389645 mediante getPorId', (done) => {
    supertest(app)
      .get('/getPorId/358470619171389645')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert(res.body.data.hasOwnProperty('categoria'));
        assert(res.body.data.categoria === "Heavyweight");
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });
  it('Devuelve Alba al recuperar los datos de la Persona con id 358470619171389645 mediante setNombre', (done) => {
    const NOMBRE_TEST= 'Alba'
    const deportista = 
    {
        id_deportista: '358470619171389645',
        nombre_deportista: NOMBRE_TEST,
        apellidos_deportista:"",
        fechaNacimiento_deportista: 
        {
            dia: 13,
            mes: 5,
            anio: 1985
        },
        aniosParticipacionOlimpiadas_deportista: [2008, 2012, 2016, 2020],
        numMedallasGanadas_deportista: 3,
        logros_deportista: [
          "Plata en Beijing 2008",
          "Oro en Londres 2012",
          "Bronce en Río 2016"
        ],
        pais_deportista: "Spain",
        categoria_deportista: "Heavyweight",
        sexo_deportista: "F"
    };
    supertest(app)
      .post('/setNombre')
      .send(deportista)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) 
      {
        assert(res.body.data.hasOwnProperty('nombre'));
        assert(res.body.data.nombre === NOMBRE_TEST);
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });
});


