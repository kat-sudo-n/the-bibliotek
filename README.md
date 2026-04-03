# the-bibliotek

## Como preparar el entorno de desarrollo

### Instalar Pocketbase
1. Descargar [pocketbase](https://pocketbase.io/)
2. Extraer pocketbase en la carpeta raíz del proyecto
3. Utilizar el comando `./pocketbase serve`
4. Va a crear todo lo necesario para ejecutar la base de datos, y va a crear un enlace en la consola para crear la cuenta de administrador
5. Crear el usuario de administrador

### Instalar la parte web
1. Instalar [Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Desde la consola, en la carpeta raíz del proyecto, usar el comando `npm install`
3. Para servir la web en local, utilizar `npm run dev`

## Apartados

### Pocketbase
- La configuración de la base de datos se hace a través de la web de Pocketbase, y se guardan automáticamente las migraciones en `pb_migrations`
- Los archivos de Javascript de `pb_hooks` se ejecutan en el servidor de Pocketbase automáticamente. Puedes encontrar más información [aquí](https://pocketbase.io/docs/js-event-hooks/)
*Los hooks de Pocketbase tiene que ser Javascript puro sin librerías*

### Web React
- Se utiliza React para la parte del frontend de la página web
