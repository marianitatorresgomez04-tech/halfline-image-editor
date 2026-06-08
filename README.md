# 🎨 Half Line - Image Editor

Una aplicación web moderna para convertir imágenes con efectos artísticos tipo halfline. Inspired by the Adobe Illustrator plugin "Half Line".

## ✨ Características

- **4 Efectos Profesionales:**
  - 🔘 **Halftone** - Crea patrones de puntos clásicos
  - ⋯ **Punteado (Stipple)** - Efecto puntillista
  - /// **Grabado (Hatching)** - Patrón de líneas entrecruzadas
  - ⬜ **Mosaico** - Efecto pixelado/mosaicos

- **Controles en Tiempo Real:**
  - Vista previa instantánea de cambios
  - Controles deslizantes ajustables para cada efecto
  - Control de brillo y contraste global

- **Interfaz Intuitiva:**
  - Drag & drop para cargar imágenes
  - Interfaz similar al plugin de Adobe
  - Diseño responsivo y moderno

- **Funciones Útiles:**
  - Resetear a valores por defecto
  - Descargar imagen procesada en PNG
  - Compatible con todos los formatos de imagen

## 🚀 Cómo Usar

1. **Cargar Imagen:** 
   - Haz clic en el área de carga o arrastra una imagen
   
2. **Seleccionar Efecto:**
   - Haz clic en uno de los 4 botones de efecto en el panel de control

3. **Ajustar Parámetros:**
   - Usa los controles deslizantes para personalizar el efecto
   - Los cambios se aplican en tiempo real

4. **Descargar:**
   - Haz clic en el botón "Descargar" para guardar la imagen procesada

## 🛠️ Estructura del Proyecto

```
halfline-image-editor/
├── index.html           # Interfaz principal
├── style.css            # Estilos (gradient, responsive)
├── script.js            # Lógica principal
├── src/
│   ├── utils.js         # Funciones auxiliares de procesamiento
│   ├── halftone.js      # Efecto Halftone
│   ├── stipple.js       # Efecto Punteado
│   ├── hatching.js      # Efecto Grabado
│   └── mosaic.js        # Efecto Mosaico
└── README.md            # Este archivo
```

## 🎮 Controles por Efecto

### Halftone
- **Tamaño de puntos** (2-20px) - Controla el tamaño de los puntos
- **Intensidad** (0-100%) - Ajusta la fuerza del efecto

### Punteado
- **Densidad** (10-100%) - Cantidad de puntos en la imagen
- **Tamaño de puntos** (1-8px) - Tamaño de cada punto

### Grabado
- **Espaciado** (1-15px) - Distancia entre líneas
- **Ángulo** (0-180°) - Dirección de las líneas

### Mosaico
- **Tamaño de teselas** (5-50px) - Tamaño de los cuadrados
- **Suavizado** (0-10px) - Blur antes del mosaico

### Globales
- **Brillo** (50-150%) - Ajusta el brillo de la imagen
- **Contraste** (50-150%) - Aumenta o reduce el contraste

## 💻 Tecnología

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con gradientes y flexbox
- **Canvas API** - Procesamiento de imágenes
- **JavaScript Vanilla** - Sin dependencias externas

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Navegadores móviles modernos

## 🔧 Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/halfline-image-editor.git
cd halfline-image-editor
```

2. Abre `index.html` en tu navegador (no requiere servidor)

O usa un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

Luego abre: `http://localhost:8000`

## 📝 Notas Técnicas

- Las imágenes se procesan en el cliente (sin servidor)
- El tamaño máximo de la imagen se reduce para rendimiento
- Todos los efectos se calculan en tiempo real
- La imagen original se preserva para cambios sin pérdida

## 🎨 Personalización

Puedes modificar fácilmente:
- Colores del tema en `style.css` (variables CSS)
- Rangos de controles en `index.html`
- Algoritmos de efectos en `src/*.js`

## 📄 Licencia

MIT License - Siéntete libre de usar y modificar

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue con:
- Descripción del problema
- Pasos para reproducir
- Imagen de ejemplo si es posible
- Navegador y versión

## 🚀 Próximas Mejoras

- [ ] Efectos adicionales (posterize, edge detection, etc)
- [ ] Exportar en múltiples formatos (JPG, WebP, SVG)
- [ ] Historial de cambios (undo/redo)
- [ ] Presets de configuración
- [ ] Soporte para lotes
- [ ] Mejoras de rendimiento para imágenes grandes

---

Hecho con ❤️ para amantes del diseño y la fotografía.
