/**
 * @file callbacks.js
 * @description Callbacks para el MS Plantilla.
 * Los callbacks son las funciones que se llaman cada vez que se recibe una petición a través de la API.
 * Las peticiones se reciben en las rutas definidas en routes.js, pero se procesan aquí.
 * @author Alba Gómez Liébana <agl00108@red.ujaen.es>
 * @date 07-mar-2023
 */


// Necesario para conectar a la BBDD faunadb
const faunadb = require('faunadb'),
    q = faunadb.query;

const client = new faunadb.Client({
    secret: 'fnAE-YylRgAAzRLy7JPO8A04vyLO5ht55mI4WfDO',
});

const COLLECTION = "Deportistas"

// CALLBACKS DEL MODELO

/**
 * Función que permite servir llamadas sin importar el origen:
 * CORS significa Cross-Origin Resource Sharing
 * Dado un objeto de tipo respuesta, le añade las cabeceras necesarias para realizar CROS
 * @param {*} res Objeto de tipo response 
 * @returns Devuelve el mismo objeto para concatenar varias llamadas al mismo
 */
function CORS(res) {
    res.header('Access-Control-Allow-Origin', '*')
        .header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
    return res;
}


/**
 * Objeto que contiene las funciones callback para interactuar con el modelo (e.d., la BBDD)
 */
const CB_MODEL_SELECTS = {
    /**
     * Prueba de conexión a la BBDD: devuelve todas los deportistas que haya en la BBDD.
     * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
     * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
     */
    test_db: async (req, res) => {
        try {
            let deportistas = await client.query(
                q.Map(
                    q.Paginate(q.Documents(q.Collection(COLLECTION))),
                    q.Lambda("X", q.Get(q.Var("X")))
                )
            )
            res.status(200).json(deportistas)
        } catch (error) {
            res.status(500).json({ error: error.description })
        }
    },

    /**
     * Método para obtener todas los deportistas de la BBDD.
     * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
     * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
     */
    getTodas: async (req, res) => {
        try {
            let deportistas = await client.query(
                q.Map(
                    q.Paginate(q.Documents(q.Collection(COLLECTION))),
                    q.Lambda("X", q.Get(q.Var("X")))
                )
            )
            CORS(res)
                .status(200)
                .json(deportistas)
        } catch (error) {
            CORS(res).status(500).json({ error: error.description })
        }
    },

    /**
    * Método para cambiar los datos de un deportista
    * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
    * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
    */
    setCampos: async (req, res) => 
    {
        try 
        {
            let valorDevuelto = {}
            let data = (Object.values(req.body)[0] === '') ? JSON.parse(Object.keys(req.body)[0]) : req.body
            let deportista = await client.query(
                q.Update(
                    q.Ref(q.Collection(COLLECTION), data.id_deportista),
                    {
                        data: 
                        {
                            nombre: data.nombre_deportista,
                            apellidos: data.apellidos_deportista,
                            pais: data.pais_deportista,
                            categoria: data.categoria_deportista,
                        },
                    },
                )
            )
                .then((ret) => {
                    valorDevuelto = ret
                    CORS(res)
                        .status(200)
                        .header( 'Content-Type', 'application/json' )
                        .json(valorDevuelto)
                })

        } catch (error) {
            CORS(res).status(500).json({ error: error.description })
        }
    },

    /**
    * Método para agregar un nuevo deportista
    * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
    * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
    */
    setNuevoDeportista: async (req, res) => 
    {
        try 
        {
          let valorDevuelto = {}
          let data = (Object.values(req.body)[0] === '') ? JSON.parse(Object.keys(req.body)[0]) : req.body
          let nuevoDeportista = await client.query(
            q.Create(
              q.Collection(COLLECTION),
              {
                data: {
                    nombre: data.nombre_deportista,
                    apellidos: data.apellidos_deportista,
                    fechaNacimiento: data.fechaNacimiento_deportista,
                    aniosParticipacionOlimpiadas: data.aniosParticipacionOlimpiadas_deportista,
                    numMedallasGanadas: data.numMedallasGanadas_deportista,
                    logros: data.logros_deportista,
                    pais: data.pais_deportista,
                    categoria: data.categoria_deportista,
                    sexo: data.sexo_deportista
                  },
                },
            )
            )
            .then((ret) => {
                valorDevuelto = ret
                CORS(res)
                    .status(200)
                    .header( 'Content-Type', 'application/json' )
                    .json(valorDevuelto)
            })
        
        } catch (error) 
        {
          console.log(error);
          CORS(res).status(500).json({ error: error.description });
        }
      },
      

    /**
     * Método para obtener una persona de la BBDD por su id.
     * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
     * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
     */
    getPorId: async (req, res) => {
        try {
            let deportista = await client.query(
                q.Get(q.Ref(q.Collection(COLLECTION), req.params.idDeportista))
            )
            CORS(res)
                .status(200)
                .json(deportista)
        } catch (error) {
            CORS(res).status(500).json({ error: error.description })
        }
        },
}

// CALLBACKS ADICIONALES
/**
 * Callbacks adicionales. Fundamentalmente para comprobar que el ms funciona.
 */
const CB_OTHERS = 
{
    /**
     * Devuelve un mensaje indicando que se ha accedido a la home del microservicio
     * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
     * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
     */
    home: async (req, res) => {
        try {
            CORS(res).status(200).json({ mensaje: "Microservicio MS Plantilla: home" });
        } catch (error) {
            CORS(res).status(500).json({ error: error.description })
        }
    },

    /**
     * Devuelve un mensaje indicando que se ha accedido a la información Acerca De del microservicio
     * @param {*} req Objeto con los parámetros que se han pasado en la llamada a esta URL 
     * @param {*} res Objeto Response con las respuesta que se va a dar a la petición recibida
     */
    acercaDe: async (req, res) => {
        try {
            CORS(res).status(200).json({
                mensaje: "Datos de la autora",
                autor: "Alba Gómez Liébana",
                email: "agl00108@red.ujaen.es",
                fecha: "07/03/2023"
            });
        } catch (error) {
            CORS(res).status(500).json({ error: error.description })
        }
    },
}

// Une todos los callbacks en un solo objeto para poder exportarlos.
// MUY IMPORTANTE: No debe haber callbacks con el mismo nombre en los distintos objetos, porque si no
//                 el último que haya SOBREESCRIBE a todos los anteriores.
exports.callbacks = { ...CB_MODEL_SELECTS, ...CB_OTHERS }
