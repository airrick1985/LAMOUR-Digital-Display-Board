/* js/fireflies.js — 花瓣與樹葉隨風飄落特效（法式浪漫：白/淡粉/金） */
(() => {
    const canvas = document.createElement('canvas');
    const container = document.querySelector('.fireflies-canvas');
    if (!container) return;

    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    const petals = [];
    const maxPetals = 45;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // 花瓣色系：柔白、淡粉、玫瑰粉
    const PETAL_COLORS = [
        'rgba(255, 250, 245, 0.9)',
        'rgba(248, 216, 222, 0.9)',
        'rgba(240, 195, 205, 0.85)',
        'rgba(252, 232, 235, 0.9)'
    ];
    // 樹葉色系：香檳金、暖金
    const LEAF_COLORS = [
        'rgba(220, 185, 130, 0.85)',
        'rgba(205, 165, 110, 0.8)',
        'rgba(235, 205, 155, 0.85)'
    ];

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.isLeaf = Math.random() < 0.3; // 三成樹葉、七成花瓣
            this.baseX = Math.random() * width;
            this.y = initial ? Math.random() * height : -30 - Math.random() * 80;
            this.size = this.isLeaf ? Math.random() * 6 + 8 : Math.random() * 5 + 6;
            this.speedY = Math.random() * 0.6 + 0.4;
            // 左右搖擺（模擬空氣阻力下的擺盪）
            this.swayAmp = Math.random() * 40 + 20;
            this.swayFreq = Math.random() * 0.0012 + 0.0006;
            this.swayPhase = Math.random() * Math.PI * 2;
            // 自身旋轉
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            // 翻面翻轉（寬度縮放模擬 3D 翻飛）
            this.flipFreq = Math.random() * 0.002 + 0.001;
            this.flipPhase = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.35 + 0.5;
            const colors = this.isLeaf ? LEAF_COLORS : PETAL_COLORS;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update(t, wind) {
            this.y += this.speedY;
            this.baseX += wind;
            this.x = this.baseX + Math.sin(t * this.swayFreq + this.swayPhase) * this.swayAmp;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 40) {
                this.reset();
            }
            // 被風吹出畫面時從另一側回收
            if (this.baseX > width + 80) this.baseX = -80;
            if (this.baseX < -80) this.baseX = width + 80;
        }

        draw(t) {
            const s = this.size;
            // 翻飛：寬度在 0.25~1 之間振盪，模擬花瓣翻面
            const flip = 0.25 + Math.abs(Math.sin(t * this.flipFreq + this.flipPhase)) * 0.75;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(flip, 1);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            ctx.beginPath();
            if (this.isLeaf) {
                // 樹葉：兩端尖的細長葉形
                ctx.moveTo(0, -s);
                ctx.bezierCurveTo(s * 0.55, -s * 0.4, s * 0.55, s * 0.4, 0, s);
                ctx.bezierCurveTo(-s * 0.55, s * 0.4, -s * 0.55, -s * 0.4, 0, -s);
                ctx.fill();
                // 葉脈
                ctx.strokeStyle = 'rgba(160, 125, 75, 0.4)';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, -s * 0.75);
                ctx.lineTo(0, s * 0.75);
                ctx.stroke();
            } else {
                // 花瓣：一端圓潤、一端微尖的瓣形
                ctx.moveTo(0, -s);
                ctx.bezierCurveTo(s * 0.85, -s * 0.55, s * 0.75, s * 0.6, 0, s * 0.9);
                ctx.bezierCurveTo(-s * 0.75, s * 0.6, -s * 0.85, -s * 0.55, 0, -s);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal());
    }

    function animate(t) {
        ctx.clearRect(0, 0, width, height);

        // 緩慢變化的風：整體向右微飄，偶爾轉向
        const wind = Math.sin(t * 0.00008) * 0.35 + 0.12;

        for (const petal of petals) {
            petal.update(t, wind);
            petal.draw(t);
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
