# Calculadora de Cotización de Préstamos para Motocicletas

Este proyecto es una aplicación web moderna desarrollada con **Angular 22** diseñada para calcular y gestionar cotizaciones de préstamos para motocicletas de manera eficiente y reactiva. 

## Características Clave
*   **Arquitectura Limpia y Modular:** 
*   **Componentes Standalone:** 
*   **Angular Signals:** 
*   **Formularios Reactivos (Reactive Forms):** 
*   **Cálculo de Cuota (Sistema Francés):** 
*   **Detección de Cambios Eficiente:** 

---

## Requisitos Previos
Asegúrese de tener instalado en su entorno de desarrollo:
*   [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
*   [npm](https://www.npmjs.com/) (Instalado automáticamente con Node)

---

## Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias
Después de descargar el proyecto, abra una terminal en la carpeta raíz y ejecute:
```bash
npm install
```

### 2. Servidor de Desarrollo
Para levantar el servidor de desarrollo local y visualizar la aplicación, ejecute:
```bash
ng serve
```
Una vez iniciado el servidor, abra su navegador favorito y navegue a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que realice cambios en los archivos fuente.

### 3. Compilación (Build)
Para compilar el proyecto y generar los artefactos listos para producción, ejecute:
```bash
ng build
```
Los archivos optimizados y listos para distribución se guardarán en el directorio `dist/motorcycle-quotes/`.

### 4. Pruebas Unitarias
Para ejecutar las pruebas unitarias configuradas con el test runner **Vitest**, ejecute:
```bash
ng test
```

---

## Estructura de Directorios Clave

```text
src/
└── app/
    ├── app.routes.ts              # Enrutador de la aplicación (RouterModule)
    ├── app.config.ts              # Configuración de proveedores globales
    ├── models/                    # Interfaces y tipos de datos TypeScript
    ├── services/                  # Servicios de lógica de negocio y cálculo
    ├── components/                # Vistas y componentes contenedores principales (Smart)
    └── shared/                    # Componentes y elementos visuales reutilizables (Dumb)
```
