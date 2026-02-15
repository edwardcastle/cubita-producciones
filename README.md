# Cubita Producciones - Sitio Web

Sitio web profesional para la agencia de booking Cubita Producciones, especializada en artistas cubanos de salsa y reguetón.

## 🚀 Características

- ✅ Next.js 16 con App Router
- ✅ TypeScript
- ✅ Multi-idioma (Español, Inglés, Francés)
- ✅ SEO Optimizado
- ✅ Responsive Design
- ✅ Formulario de contacto
- ✅ Sistema de gestión de artistas
- ✅ Tailwind CSS
- ✅ Sitemap y Robots.txt automáticos

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start
```

## 📝 PASOS INMEDIATOS - NECESITO DE TI

### 1. Fotos de Artistas
Sube las fotos a `/public/artists/` con estos nombres:
- talent-fuego.jpg
- wildey.jpg
- ja-rulay.jpg
- manolin.jpg
- charly-johayron.jpg
- jacob-forever.jpg

### 2. Logo de Cubita
- Sube tu logo a `/public/logo.png`

### 3. Datos de Contacto
Edita estos archivos con tu info real:

`/components/layout/Footer.tsx`:
```typescript
<span>info@cubitaproducciones.com</span>  // ← TU EMAIL
<span>+39 XXX XXX XXXX</span>  // ← TU TELÉFONO
```

### 4. Bios de Artistas
Edita `/lib/data/artists.ts` con las bios reales (2-3 líneas cada uno)

### 5. Links de Redes Sociales
En el mismo archivo, agrega Instagram/YouTube de cada artista:
```typescript
instagram: 'https://instagram.com/talentfuego',
youtube: 'https://youtube.com/@talentfuego'
```

## 🚀 Deploy en Vercel (5 minutos)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

Vercel te dará una URL temporal (ej: cubita-producciones.vercel.app)

## 🌐 Conectar Dominio

1. Compra cubitaproducciones.com en Namecheap (€12/año)
2. En Vercel Dashboard:
   - Settings → Domains
   - Add Domain: cubitaproducciones.com
   - Copia los nameservers que te da Vercel
3. En Namecheap:
   - Domain List → Manage
   - Nameservers → Custom DNS
   - Pega los nameservers de Vercel
4. Espera 24h para propagación

## 📧 Configurar Emails (Opcional pero Recomendado)

### Opción A: Resend (para formulario)
1. resend.com → Sign Up
2. Add Domain → cubitaproducciones.com
3. Get API Key
4. Crea `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```
5. Descomenta código en `/app/api/contact/route.ts`

### Opción B: Email Profesional
- Google Workspace: €6/mes → eduardo@cubitaproducciones.com
- Zoho Mail: €1/mes → más económico

## 📊 Testing Local

```bash
npm run dev
```

Abre: http://localhost:3000

Prueba:
- ✅ Cambio de idioma (ES/EN/FR)
- ✅ Navegación entre páginas
- ✅ Formulario de contacto
- ✅ Páginas de artistas
- ✅ Responsive (F12 → Device Toolbar)

## 🎨 Personalizar Colores

`tailwind.config.ts`:
```typescript
colors: {
  primary: '#DC2626', // Rojo actual - cambiar si quieres
}
```

## 📁 Estructura Importante

```
/public/artists/        ← SUBIR FOTOS AQUÍ
/public/logo.png        ← SUBIR LOGO AQUÍ
/lib/data/artists.ts    ← EDITAR BIOS Y LINKS
/components/layout/Footer.tsx  ← EDITAR CONTACTO
/messages/              ← Traducciones (no tocar)
```

## 🐛 Problemas Comunes

**Imágenes no aparecen:**
```bash
# Verificar que las fotos estén en /public/artists/
ls public/artists/
```

**Error de compilación:**
```bash
rm -rf .next
npm run build
```

**Puerto ocupado:**
```bash
# Cambiar puerto
npm run dev -- -p 3001
```

## ✅ Checklist Pre-Launch

- [ ] Fotos de todos los artistas subidas
- [ ] Logo de Cubita agregado
- [ ] Bios actualizadas
- [ ] Email y teléfono actualizados
- [ ] Links de redes sociales agregados
- [ ] Dominio comprado
- [ ] Sitio deployado en Vercel
- [ ] Dominio conectado
- [ ] Email profesional configurado
- [ ] Formulario de contacto testeado

## 📞 Siguiente Paso

**AHORA:** Súbeme las fotos y el logo, y yo las integro en el proyecto en 5 minutos.

**LUEGO:** Te enseño a deployarlo en Vercel (literalmente 3 comandos).

## 🎯 Costos Totales

- Dominio: €12/año
- Hosting Vercel: €0 (gratis)
- Email (opcional): €1-6/mes
- **TOTAL: €12-84/año**

---

© 2025 Cubita Producciones | Desarrollado con Next.js 16
