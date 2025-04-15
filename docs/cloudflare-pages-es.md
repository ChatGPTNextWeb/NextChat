# Guía de implementación de Cloudflare Pages

## Cómo crear un nuevo proyecto

Bifurca el proyecto en Github, luego inicia sesión en dash.cloudflare.com y ve a Pages.

1.  Haga clic en "Crear un proyecto".
2.  Selecciona Conectar a Git.
3.  Vincula páginas de Cloudflare a tu cuenta de GitHub.
4.  Seleccione este proyecto que bifurcó.
5.  Haga clic en "Comenzar configuración".
6.  Para "Nombre del proyecto" y "Rama de producción", puede utilizar los valores predeterminados o cambiarlos según sea necesario.
7.  En Configuración de compilación, seleccione la opción Ajustes preestablecidos de Framework y seleccione Siguiente.js.
8.  Debido a los errores de node:buffer, no use el "comando Construir" predeterminado por ahora. Utilice el siguiente comando:
    ```
    npx @cloudflare/next-on-pages --experimental-minify
    ```
9.  Para "Generar directorio de salida", utilice los valores predeterminados y no los modifique.
10. No modifique el "Directorio raíz".
11. Para "Variables de entorno", haga clic en ">" y luego haga clic en "Agregar variable". Rellene la siguiente información:

    *   `NODE_VERSION=20.1`
    *   `NEXT_TELEMETRY_DISABLE=1`
    *   `OPENAI_API_KEY=你自己的API Key`
    *   `YARN_VERSION=1.22.19`
    *   `PHP_VERSION=7.4`

    Dependiendo de sus necesidades reales, puede completar opcionalmente las siguientes opciones:

    *   `CODE= 可选填，访问密码，可以使用逗号隔开多个密码`
    *   `OPENAI_ORG_ID= 可选填，指定 OpenAI 中的组织 ID`
    *   `HIDE_USER_API_KEY=1 可选，不让用户自行填入 API Key`
    *   `DISABLE_GPT4=1 可选，不让用户使用 GPT-4`
12. Haga clic en "Guardar e implementar".
13. Haga clic en "Cancelar implementación" porque necesita rellenar los indicadores de compatibilidad.
14. Vaya a "Configuración de compilación", "Funciones" y busque "Indicadores de compatibilidad".
15. Rellene "nodejs_compat" en "Configurar indicador de compatibilidad de producción" y "Configurar indicador de compatibilidad de vista previa".
16. Vaya a "Implementaciones" y haga clic en "Reintentar implementación".
17. Disfrutar.
