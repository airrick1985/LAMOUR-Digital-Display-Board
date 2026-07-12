/* js/cursor-petals.js — 全域滑鼠拖尾特效：小花瓣 + 蝴蝶（藍色系） */
(() => {
    if (window.__cursorPetalsInit) return;
    window.__cursorPetalsInit = true;

    const MAX_PETALS = 120;      // 花瓣粒子上限
    const SPAWN_DIST = 16;       // 游標每移動多少 px 生成一片
    const MAX_BUTTERFLIES = 5;   // 同時存在的蝴蝶上限
    const BUTTERFLY_CHANCE = 0.07; // 每次生成花瓣時出現蝴蝶的機率
    const PETAL_COLORS = [
        [248, 216, 222],   // 淡粉
        [240, 195, 205],   // 玫瑰粉
        [255, 250, 245],   // 柔白
        [235, 205, 155]    // 香檳金
    ];
    const BUTTERFLY_COLORS = [
        [96, 150, 235],    // 湛藍
        [126, 178, 245],   // 天藍
        [82, 128, 215]     // 靛藍
    ];

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    const petals = [];
    let lastX = null, lastY = null;

    class TrailPetal {
        constructor(x, y, vx, vy) {
            this.x = x + (Math.random() - 0.5) * 8;
            this.y = y + (Math.random() - 0.5) * 8;
            // 繼承少量游標速度 + 隨機飄散
            this.vx = vx * 0.12 + (Math.random() - 0.5) * 0.8;
            this.vy = vy * 0.12 + (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 4 + 3;   // 3~7px 小花瓣
            this.life = 1;
            this.decay = Math.random() * 0.008 + 0.010;  // 約 1~1.5 秒消散
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.08;
            this.flipFreq = Math.random() * 0.004 + 0.002;
            this.flipPhase = Math.random() * Math.PI * 2;
            this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.025;      // 微重力：花瓣緩緩下墜
            this.vx *= 0.985;      // 空氣阻力
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        }

        draw(t) {
            const s = this.size * (0.55 + this.life * 0.45); // 隨消散略縮小
            const flip = 0.3 + Math.abs(Math.sin(t * this.flipFreq + this.flipPhase)) * 0.7;
            const [r, g, b] = this.color;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(flip, 1);
            ctx.globalAlpha = Math.max(this.life, 0) * 0.85;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.bezierCurveTo(s * 0.85, -s * 0.55, s * 0.75, s * 0.6, 0, s * 0.9);
            ctx.bezierCurveTo(-s * 0.75, s * 0.6, -s * 0.85, -s * 0.55, 0, -s);
            ctx.fill();
            ctx.restore();
        }
    }

    const butterflies = [];

    class TrailButterfly {
        constructor(x, y, dx, dy) {
            this.x = x;
            this.y = y;
            // 初始朝向大致跟隨游標移動方向，之後自由飛
            this.heading = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
            this.speed = Math.random() * 0.6 + 0.7;
            this.size = Math.random() * 5 + 10;  // 10~15px
            this.life = 1;
            this.decay = Math.random() * 0.002 + 0.003;  // 約 3~5 秒
            // 飛行路徑的左右擺盪（蝴蝶式不規則飛行）
            this.wanderFreq = Math.random() * 0.003 + 0.002;
            this.wanderPhase = Math.random() * Math.PI * 2;
            // 拍翅
            this.flapSpeed = Math.random() * 0.01 + 0.018;
            this.flapPhase = Math.random() * Math.PI * 2;
            this.color = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)];
        }

        update(t) {
            // 不規則轉向 + 輕微向上飄（蝴蝶往上飛而不是下墜）
            this.heading += Math.sin(t * this.wanderFreq + this.wanderPhase) * 0.06;
            this.x += Math.cos(this.heading) * this.speed;
            this.y += Math.sin(this.heading) * this.speed - 0.25;
            // 拍翅造成的上下顫動
            this.y += Math.sin(t * this.flapSpeed + this.flapPhase) * 0.3;
            this.life -= this.decay;
        }

        drawWing(s, flap) {
            // 單側翅膀：圓潤的前翅（大）+ 後翅（小），由體側向翅尖的藍色漸層
            ctx.save();
            ctx.scale(flap, 1);

            const [r, g, b] = this.color;
            const grad = ctx.createLinearGradient(0, 0, s * 1.4, 0);
            grad.addColorStop(0, `rgb(${Math.min(r + 70, 255)}, ${Math.min(g + 55, 255)}, ${Math.min(b + 20, 255)})`);
            grad.addColorStop(1, `rgb(${r}, ${g}, ${b})`);
            ctx.fillStyle = grad;

            ctx.beginPath(); // 前翅：向斜上方展開的圓潤翼面
            ctx.moveTo(0, -s * 0.05);
            ctx.bezierCurveTo(s * 0.35, -s * 1.15, s * 1.45, -s * 1.05, s * 1.3, -s * 0.35);
            ctx.bezierCurveTo(s * 1.15, s * 0.02, s * 0.4, s * 0.08, 0, s * 0.02);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath(); // 後翅：較小的圓瓣，向斜下方
            ctx.moveTo(0, s * 0.06);
            ctx.bezierCurveTo(s * 0.75, s * 0.1, s * 1.0, s * 0.65, s * 0.6, s * 1.0);
            ctx.bezierCurveTo(s * 0.3, s * 1.25, s * 0.02, s * 0.75, 0, s * 0.18);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        draw(t) {
            const s = this.size;
            // 拍翅：兩翼在 0.3~1 之間開合（不完全壓扁，避免看起來像細線）
            const flap = 0.3 + Math.abs(Math.sin(t * this.flapSpeed + this.flapPhase)) * 0.7;
            // 淡入淡出：前 15% 淡入、其餘隨 life 淡出
            const fadeIn = Math.min((1 - this.life) / 0.15, 1);
            const alpha = Math.max(this.life, 0) * fadeIn * 0.9;

            ctx.save();
            ctx.translate(this.x, this.y);
            // 身體朝向飛行方向（翅膀畫在垂直軸兩側，所以轉向後再補 90 度）
            ctx.rotate(this.heading + Math.PI / 2);
            ctx.globalAlpha = alpha;

            this.drawWing(s, flap);          // 右翅
            ctx.scale(-1, 1);
            this.drawWing(s, flap);          // 左翅（鏡像）
            ctx.scale(-1, 1);

            // 身體：細長深藍橢圓，與翅膀做出區隔
            ctx.fillStyle = 'rgba(45, 55, 78, 0.9)';
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.09, s * 0.42, 0, 0, Math.PI * 2);
            ctx.fill();

            // 觸角：兩根向前的細曲線
            ctx.strokeStyle = 'rgba(45, 55, 78, 0.9)';
            ctx.lineWidth = Math.max(s * 0.05, 0.6);
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.35);
            ctx.quadraticCurveTo(s * 0.18, -s * 0.72, s * 0.3, -s * 0.85);
            ctx.moveTo(0, -s * 0.35);
            ctx.quadraticCurveTo(-s * 0.18, -s * 0.72, -s * 0.3, -s * 0.85);
            ctx.stroke();
            ctx.restore();
        }
    }

    function onPointerMove(e) {
        const x = e.clientX, y = e.clientY;
        if (lastX === null) {
            lastX = x;
            lastY = y;
            return;
        }
        const dx = x - lastX, dy = y - lastY;
        const dist = Math.hypot(dx, dy);

        if (dist >= SPAWN_DIST && petals.length < MAX_PETALS) {
            // 快速移動時沿路徑補生成，最多 3 片，避免斷點
            const count = Math.min(3, Math.floor(dist / SPAWN_DIST));
            for (let i = 1; i <= count; i++) {
                const px = lastX + (dx * i) / count;
                const py = lastY + (dy * i) / count;
                petals.push(new TrailPetal(px, py, dx, dy));
            }
            // 偶爾有蝴蝶跟著游標飛出來
            if (butterflies.length < MAX_BUTTERFLIES && Math.random() < BUTTERFLY_CHANCE) {
                butterflies.push(new TrailButterfly(x, y, dx, dy));
            }
            lastX = x;
            lastY = y;
        }
    }

    function animate(t) {
        // SPA 換頁會以 innerHTML 覆寫 body 導致 canvas 被移除，偵測到就重新掛回
        if (!canvas.isConnected && document.body) {
            document.body.appendChild(canvas);
        }
        ctx.clearRect(0, 0, width, height);
        for (let i = petals.length - 1; i >= 0; i--) {
            const p = petals[i];
            p.update();
            if (p.life <= 0 || p.y > height + 20) {
                petals.splice(i, 1);
            } else {
                p.draw(t);
            }
        }
        for (let i = butterflies.length - 1; i >= 0; i--) {
            const b = butterflies[i];
            b.update(t);
            if (b.life <= 0 || b.y < -30 || b.x < -30 || b.x > width + 30) {
                butterflies.splice(i, 1);
            } else {
                b.draw(t);
            }
        }
        requestAnimationFrame(animate);
    }

    function init() {
        document.body.appendChild(canvas);
        resize();
        window.addEventListener('resize', resize);
        // pointermove 同時涵蓋滑鼠與觸控拖曳（電子看板適用）
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        requestAnimationFrame(animate);
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
