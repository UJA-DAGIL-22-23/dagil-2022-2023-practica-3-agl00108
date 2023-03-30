/**
 * @file server-spec.js 
 * @description Fichero con la especificación de pruebas para la aplicación API-gateway
 * Este fichero DEBE llamarse server-spec.js
 * Este fichero DEBE ubicarse en el subdirectorio spec/
 * @author Alba Gómez Liébana <agl00108@readonly.ujaen.es>
 * @date 03-feb-2023
 */

const supertest = require('supertest');
const assert = require('assert')
const app = require('../server');

describe('API Gateway: rutas estáticas', () => {
  describe('Rutas estáticas de MS Plantilla', () => {
    it('Devuelve MS Plantilla Home Page', (done) => {
      supertest(app)
        .get('/plantilla/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: home");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve MS Plantilla Acerca De', (done) => {
      supertest(app)
        .get('/plantilla/acercade')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Datos de la autora");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });

    it('Devuelve F al consultar mediante test_db', (done) => {
        supertest(app)
          .get('/plantilla/test_db')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function (res) {
            assert(res.body.data[0].data.hasOwnProperty('sexo'));
            assert(res.body.data[0].data.sexo === "F");
  
          })
          .end((error) => { error ? done.fail(error) : done(); }
          );
    });

    it('Obtiene todos los deportistas: debe tener un campo data que es un array de 10 objetos', (done) => {
      supertest(app)
        .get('/plantilla/getTodas')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert(res.body.hasOwnProperty('data'));
          assert(res.body.data.length === 10);

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve Heavyweight al recuperar los datos de la Persona con id 358470619171389645 mediante getPorId', (done) => {
      supertest(app)
        .get('/plantilla/getPorId/358470619171389645')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert(res.body.data.hasOwnProperty('sexo'));
          assert(res.body.data.sexo === "F");
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });
    it('Devuelve Alba al recuperar los datos de la Persona con id 358470619171389645 mediante setCampos', (done) => {
      const NOMBRE_TEST= 'Alba'
    const APELLIDOS_TEST= 'Gómez Liébana'
    const PAIS_TEST= 'Españita'
    const CATEGORIA_TEST='Lightweight'
    const deportista = 
    {
        id_deportista: '358470619171389645',
        nombre_deportista: NOMBRE_TEST,
        apellidos_deportista:APELLIDOS_TEST,
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
        pais_deportista: PAIS_TEST,
        categoria_deportista: CATEGORIA_TEST,
        sexo_deportista: "F"
    };
      supertest(app)
        .post('/plantilla/setCampos')
        .send(deportista)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) 
        {
          assert(res.body.data.hasOwnProperty('nombre'));
          assert(res.body.data.nombre === NOMBRE_TEST);
  
          assert(res.body.data.hasOwnProperty('apellidos'));
          assert(res.body.data.apellidos === APELLIDOS_TEST);
  
          assert(res.body.data.hasOwnProperty('pais'));
          assert(res.body.data.pais === PAIS_TEST);
  
          assert(res.body.data.hasOwnProperty('categoria'));
          assert(res.body.data.categoria === CATEGORIA_TEST);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });
  })
});



