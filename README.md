# OH Habana Menu QR

Esta carpeta contiene una version web del menu en formato tipo agenda y un QR imprimible.

- Abre `index.html` para ver el menu localmente.
- Usa `assets/qr/oh-habana-qr-imprimir.png` para imprimir el QR.
- El QR actual apunta al archivo local, solo para prueba.

Cuando tengas una URL publica, regenera el QR asi:

```powershell
& 'C:\Users\RODO\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\RODO\Documents\New project\oh-habana-menu\build_assets.py' 'https://tu-dominio.com/menu/'
```

Para que funcione con celulares de clientes, publica este repositorio con GitHub Pages y usa esa URL publica para generar el QR final.
