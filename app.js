import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
let adds = 'https://workink.net/27tB/ad0ohknz';

document.addEventListener("DOMContentLoaded", () => {
  const ref = document.referrer;
  const allowedRef = ref.includes("workink");
  const params = new URLSearchParams(window.location.search);
  const token = params.get('key');
  const wrap = document.querySelector('.wrap');

  console.log(token)
  console.log(allowedRef)
  console.log(token && allowedRef)
  //https://caraswapper.netlify.app?key=ok

  if (token != 'ok') {
    //location.href = adds;  
  } else {

    if (allowedRef) {
      // Cargar interfaz principal
      wrap.innerHTML = `
        <h1>FaceSwap - Enviar dos imágenes</h1>
        <p class="lead">Selecciona la imagen de fondo y la de la cara, luego pulsa <strong>Enviar</strong>.</p>

        <div class="grid">
          <div class="card">
            <label for="background">Imagen de fondo</label>
            <input id="background" type="file" accept="image/*">
            <img id="previewBg" class="preview" style="display:none" alt="preview background">

            <label for="face" style="margin-top:12px">Imagen de rostro</label>
            <input id="face" type="file" accept="image/*">
            <img id="previewFace" class="preview" style="display:none" alt="preview face">

            <div class="controls">
              <button id="sendBtn">Enviar</button>
              <button id="clearBtn" type="button">Limpiar</button>
            </div>
          </div>
        </div>
      `;

      // Elementos DOM recién creados
      const bgInput = document.getElementById('background');
      const faceInput = document.getElementById('face');
      const previewBg = document.getElementById('previewBg');
      const previewFace = document.getElementById('previewFace');
      const sendBtn = document.getElementById('sendBtn');
      const clearBtn = document.getElementById('clearBtn');

      function resetUI() {
        previewBg.style.display = 'none';
        previewFace.style.display = 'none';
        previewBg.src = '';
        previewFace.src = '';
      }

      bgInput.addEventListener('change', e => {
        const f = e.target.files?.[0];
        if (!f) return;
        previewBg.src = URL.createObjectURL(f);
        previewBg.style.display = 'block';
      });

      faceInput.addEventListener('change', e => {
        const f = e.target.files?.[0];
        if (!f) return;
        previewFace.src = URL.createObjectURL(f);
        previewFace.style.display = 'block';
      });

      clearBtn.addEventListener('click', () => {
        bgInput.value = '';
        faceInput.value = '';
        resetUI();
      });

      sendBtn.addEventListener('click', async () => {
        const bgFile = bgInput.files?.[0];
        const faceFile = faceInput.files?.[0];
        if (!bgFile || !faceFile) {
          alert('Selecciona ambas imágenes antes de enviar.');
          return;
        }

        sendBtn.disabled = true;
        clearBtn.disabled = true;

        try {
          const client = await Client.connect("elecpon/faceswapper");
          const result = await client.predict("/swap", {
            background_img: bgFile,
            face_img: faceFile
          });

          let imageUrl = result.data[1].url;

          if (imageUrl) {
            wrap.innerHTML = `
              <div class="result" id="resultArea">
                <h3 style="margin-top:8px">Resultado</h3>
                <img id="resultImg" src="${imageUrl}" alt="Resultado FaceSwap">
                <div style="margin-top:10px" class="row">
                  <a id="downloadLink" href="${imageUrl}" download="faceswap_result.jpg">Descargar</a>
                </div>
              </div>
            `;

          } else {
            location.href = adds
          }

        } catch (err) {
          console.error(err);
          alert('Ocurrió un error: ' + String(err));
        } finally {
          sendBtn.disabled = false;
          clearBtn.disabled = false;
        }
      });

      resetUI();
 
    } else {
     // location.href = adds
    }
  }
});
