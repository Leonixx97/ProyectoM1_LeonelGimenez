const palette = document.getElementById("palette");
    const generateBtn = document.getElementById("generateBtn");
    const paletteSize = document.getElementById("paletteSize");
    const colorFormat = document.getElementById("colorFormat");
    const toast = document.getElementById("toast");

    function randomNumber(max) {
      return Math.floor(Math.random() * max);
    }

    function generateHSLValues() {
      return {
        h: randomNumber(360),
        s: randomNumber(100),
        l: randomNumber(100)
      };
    }

    function hslToString(h, s, l) {
      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r = 0;
      let g = 0;
      let b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
      } else if (120 <= h && h < 180) {
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        b = c;
      } else {
        r = c;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
      ).toUpperCase();
    }

    function generateColor(format) {

      const { h, s, l } = generateHSLValues();

      const hsl = hslToString(h, s, l);
      const hex = hslToHex(h, s, l);

      return {
        preview: hsl,
        code: format === "hex" ? hex : hsl
      };
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    }

    function createPalette(size, format) {

      palette.innerHTML = "";

      for (let i = 0; i < size; i++) {

        const color = generateColor(format);

        const card = document.createElement("article");
        card.classList.add("color-card");

        card.innerHTML = `
          <div
            class="color-preview"
            style="background:${color.preview}"
            aria-label="Color ${color.code}"
          ></div>

          <div class="color-info">

            <div class="code-group">
              <span class="code">${color.code}</span>

              <button
                class="copy-btn"
                aria-label="Copiar código"
              >
                Copiar
              </button>
            </div>

          </div>
        `;

        const copyBtn = card.querySelector(".copy-btn");

        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(color.code);
          showToast(`${format.toUpperCase()} copiado`);
        });

        palette.appendChild(card);
      }
    }

    generateBtn.addEventListener("click", () => {

      const size = Number(paletteSize.value);
      const format = colorFormat.value;

      createPalette(size, format);

      showToast("Nueva paleta generada");
    });

    createPalette(6, "hex");