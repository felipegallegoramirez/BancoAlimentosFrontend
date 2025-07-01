# Tabla de Salidas (Exits) - Banco de Alimentos

## Descripción
Este componente muestra una tabla con Materialize CSS que lista todas las salidas de productos realizadas en el sistema del Banco de Alimentos.

## Características

### Funcionalidades Principales
- **Visualización de datos**: Muestra todos los exits con información detallada
- **Información mostrada**:
  - ID de la salida
  - Nombre del producto
  - Cantidad salida
  - Beneficiario
  - Fecha de creación
  - Fecha de última actualización
- **Acciones disponibles**:
  - Ver detalles (botón azul con icono de ojo)
  - Eliminar salida (botón rojo con icono de basura)

### Diseño y UX
- **Materialize CSS**: Utiliza el framework Materialize para un diseño moderno y responsive
- **Loading spinner**: Muestra un indicador de carga mientras se obtienen los datos
- **Mensajes informativos**: 
  - Error si hay problemas al cargar datos
  - Mensaje cuando no hay salidas registradas
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Botón flotante**: Para agregar nuevas salidas

### Estructura de Datos
La tabla muestra información de:
- **Exit**: Datos de la salida (ID, cantidad, fechas)
- **Product**: Información del producto (nombre)
- **Beneficiary**: Información del beneficiario (nombre legal)

## Rutas
- **URL**: `/exitlist`
- **Protección**: Requiere autenticación (AuthGuard)

## Dependencias
- Materialize CSS (incluido via CDN)
- Angular Material Icons
- Servicios: ExitService, ProductService, BeneficiaryService

## Uso
1. Navegar a `/exitlist`
2. La tabla se carga automáticamente
3. Usar los botones de acción para ver detalles o eliminar
4. Usar el botón flotante para agregar nuevas salidas

## Estilos Personalizados
- Tabla con rayas alternadas
- Efectos hover en las filas
- Chips para productos y beneficiarios
- Badges para cantidades
- Diseño responsive para móviles 