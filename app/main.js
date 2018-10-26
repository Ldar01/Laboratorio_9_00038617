const http = require('http'),
  fs = require('fs'),
  url = require('url'),
  {
    parse
  } = require('querystring');

mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}; 

/*
    ¿Cuál es la principal función del módulo HTTP? R// Este permite la transferencia de datos, atravez de una comunicacion de web servidor
    y un navegador e indica el protocolo que utilizamos para contectarnos con un servidor web.

    ¿Cuál es la principal función del módulo FileSystem? R// Permite trabajar con los archivos de sistema de la computadora.

    ¿Qué es un MIME type? R// Un MIME type es una extension de multriposito de correo de Internet
*/

http.createServer((req, res)=>{
  //Control code.
}).listen(8081); 

function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    // Evento de acumulacion de data.
    request.on('data', chunk => {
      body += chunk.toString();
    });
    // Data completamente recibida
    request.on('end', () => {
      callback(null, parse(body));
    });
  } else {
    callback({
      msg: `The content-type don't is equals to ${FORM_URLENCODED}`
    });
  }
}

/**
 * 
    ¿Qué contienen las variables "req" y "res" en la creación del servidor?R// La varaible req contiene la peticion (request) y la variable
    res contiene la respuesta (response) que tendra la pagina.
    ¿La instrucción .listen(number) puede fallar? Justifique. R// Puede fallar si no se pone el puerto correcto o si no existe
    ¿Por qué es útil la función "collectRequestData(...)"? R// Para que pueda tener una mejor interaccion entre la pagina con el servidor

 */

var pathname = url.parse(req.url).pathname; 

if(pathname == "/"){
  pathname = "../index.html";
} 


if(pathname == "../index.html"){
  fs.readFile(pathname, (err, data)=>{

    if (err) {
      console.log(err);
      // HTTP Status: 404 : NOT FOUND
      // En caso no haberse encontrado el archivo
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });       return res.end("404 Not Found");     }
    // Pagina encontrada
    // HTTP Status: 200 : OK

    res.writeHead(200, {
      'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
    });

    // Escribe el contenido de data en el body de la respuesta.
    res.write(data.toString());


    // Envia la respuesta
    return res.end();
  });
} 

if (req.method === 'POST' && pathname == "/cv") {
      collectRequestData(req, (err, result) => {
    
        if (err) {
          res.writeHead(400, {
            'content-type': 'text/html'
          });
          return res.end('Bad Request');
        }
    
        fs.readFile("../templates/plantilla.html", function (err, data) {
          if (err) {
            console.log(err);
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            res.writeHead(404, {
              'Content-Type': 'text/html'
            });
            return res.end("404 Not Found");
          }
    
          res.writeHead(200, {
            'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
          });
    
          //Variables de control.
    
          let parsedData = data.toString().replace('${dui}', result.dui)
            .replace("${lastname}", result.lastname)
            .replace("${firstname}", result.firstname)
            .replace("${gender}", result.gender)
            .replace("${civilStatus}", result.civilStatus)
            .replace("${birth}", result.birth)
            .replace("${exp}", result.exp)
            .replace("${tel}", result.tel)
            .replace("${std}", result.std);

          res.write(parsedData);
          return res.end();
        });
    
      });
    }

if(pathname.split(".")[1] == "css"){
      fs.readFile(".."+pathname, (err, data)=>{
    
        if (err) {
          console.log(err);
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });       return res.end("404 Not Found");     }
    
        res.writeHead(200, {
          'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
        });
    
        // Escribe el contenido de data en el body de la respuesta.
        res.write(data.toString());
    
    
        // Envia la respuesta
        return res.end();
      });
    } 

/**
 * ¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"? R// Te puede ayudar a poder trabajar en el
 * directorio donde se encuentra el elemento que se esta utilizado como guardar datos y entre otras cosas.
 */

/**
 *  ¿Qué contine el parametro "data"?  R// Contiene los datos que obtiene la pagina
 * ¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS? R//Pues con lo que yo entiendo es que brindar una respuesta en
 * HTML es que mostrara el
 * 
    ¿Qué contiene la variable "result"? R// Contiene los datos guardados las variables de contorno
    ¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique. R//Para que se pueda manipular los datos


    ¿Hay diferencia al quitar el control de peticiones para hojas CSS? Si sucedió algo distinto justifique por qué. R//
    ¿Se puede inciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique.
    Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's? R//

 */

