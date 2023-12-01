//supertest
//jest
const request = require('supertest');

let app='http://localhost:5000';

describe("Testear Get a la ruta de clientes con CallBack", ()=>{
  it("Prueba metodo GET de clientes",()=>{
      request(app)
          .get('/clientes')
          .expect(200)
          .end((err,res) =>{
          if(err) throw err;
          console.log('GET / deberia devolver un array de alumnos')
          });
  })
})

describe('Prueba la ruta GET de clientes con CallBack y Async-Await', () => {
  it('Prueba método GET de clientes', async () => {
    const response = await request(app).get('/clientes');
    expect(response.status).toBe(200);
    console.log('GET /clientes debería devolver un array de clientes');
  });
});


