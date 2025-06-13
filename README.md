# ToDo-React

##  Tecnologías Usadas

- **Backend**: Supabase (Base de datos y Autenticación)
- **Frontend**: React 18
- **Estilos**: Tailwind CSS
- **Testing**: Vitest
- **Build Tool**: Vite

![Tecnologias](./public/Screenshot%202025-06-13%20082806.png)


##  Cómo Ejecutar el Proyecto

1. Clona el repositorio:
```bash
git clone https://github.com/EnriDv/ToDo-App-React.git
cd ToDo-React
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
- Copia el archivo `.env.example` a `.env`
- Agrega tus credenciales de Supabase

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Para ejecutar las pruebas:
```bash
npm run test
```

##  Patrones de Diseño Aplicados

1. **Repository Pattern**:
   - **Descripción:** Encapsula la lógica de acceso a datos y operaciones CRUD para entidades como tareas y categorías, desacoplando el acceso a la base de datos del resto de la app.
   - **Implementación:**
     - `src/services/TaskRepository.js`
     - `src/services/CategoryRepository.js`

2. **Singleton Pattern**:
   - **Descripción:** Garantiza que exista una única instancia de los repositorios y del cliente Supabase durante toda la aplicación.
   - **Implementación:**
     - `export const taskRepository = new TaskRepository();` en `src/services/TaskRepository.js`
     - `export const categoryRepository = new CategoryRepository();` en `src/services/CategoryRepository.js`
     - El cliente Supabase en `src/supabase-client.js` utiliza un objeto para almacenar instancias por esquema y no recrearlas.

3. **Observer Pattern**:
   - **Descripción:** Permite reacción en tiempo real a cambios en tareas y categorías. Los componentes pueden suscribirse a eventos y actualizarse automáticamente cuando hay cambios en los datos.
   - **Implementación:**
     - `src/utils/Subject.js` (implementa el Subject para notificar a los listeners)
     - Usado en los repositorios: `TaskRepository.js` y `CategoryRepository.js` para emitir eventos de cambio y que los componentes reaccionen.

Estos patrones ayudan a mantener el código:
- Desacoplado y modular
- Fácil de mantener y extender
- Reactivo y actualizado en tiempo real

##  Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── tasks/
│   └── categories/
│   └── Sheets/
├── pages/               # Páginas principales
│   └── home.jsx        # Página principal
│   └── Sheet.jsx        # Página principal de la hoja de tareas
├── services/            # Servicios y repositorios
│   └── TaskRepository.js 
├── utils/              
│   └── Subject.js      # Implementación del patrón Observer
├── supabase-client.js   # Cliente de Supabase
└── App.jsx             # Componente principal
```

![/src](./public/Screenshot%202025-06-13%20083220.png)
![/src/components](./public/Screenshot%202025-06-13%20083232.png)

## Descripción del Problema

La aplicación resuelve el problema de organización y seguimiento de tareas personales/profesionales. Muchas personas tienen dificultades para:
- Mantener un seguimiento de sus tareas
- Organizar tareas en diferentes categorías
- Establecer límites de tiempo
- Acceder a sus tareas desde diferentes dispositivos

##  Solución Propuesta

Una aplicación web moderna que permite:
- Crear, editar y eliminar tareas
- Organizar tareas en categorías
- Establecer límites de tiempo para cada tarea
- Visualizar el progreso de las tareas
- Acceder a las tareas desde cualquier dispositivo
- Autenticación segura de usuarios

##  Historias de Usuario

No se llegaron a documentar todas las hu a profundidad, pero aqui estan las que si se documentaron:
http://159.69.123.44/spaces/issues/a48cdfecf6a9448ab644f47f236aa78f

##  Lecciones Aprendidas

1. **Manejo de Estado en React**:
   - Uso eficiente de useState y useEffect
   - Validación de formularios

2. **Integración con Supabase**:
   - Autenticación de usuarios
   - CRUD operations
   - Manejo de timestamps
   - Manejo de errores (muchos)

3. **No volver a dejar la IA tocar mi codigo**:
   - Mas tiempo depurando y arreglando errores de lo que me gustaria

### **Aclaracion:**

Se realizo el login/register con el siguiente repositorio encontrado en un tutorial: https://github.com/fireclint/supabase-email-auth-context