/* js/hero-video.js — 首頁背景影片：雙影片交叉淡化無縫循環
   慢速效果由影片本身實現（FFmpeg minterpolate 光流補幀的 50% 慢速 60fps 版本），
   以原速播放避免 playbackRate 降速造成的頓挫感 */
(() => {
    const videos = document.querySelectorAll('.hero-bg video');
    if (videos.length === 0) return;

    const PLAYBACK_RATE = 1;     // 原速播放（慢速已烘焙進影片，補幀後不會頓挫）
    const CROSSFADE_SEC = 1.2;   // 交叉淡化時長，需與 CSS transition 一致

    videos.forEach(v => {
        v.playbackRate = PLAYBACK_RATE;
        // 部分瀏覽器在 loadedmetadata 後才允許設定，保險再設一次
        v.addEventListener('loadedmetadata', () => {
            v.playbackRate = PLAYBACK_RATE;
        });
    });

    // 只有一支影片時退回原生 loop
    if (videos.length < 2) {
        videos[0].loop = true;
        return;
    }

    let active = 0;
    let switching = false;

    setInterval(() => {
        const cur = videos[active];
        if (switching || !cur.duration || cur.paused) return;

        // 換算成實際時間的剩餘秒數（受播放速度影響）
        const remaining = (cur.duration - cur.currentTime) / PLAYBACK_RATE;

        if (remaining <= CROSSFADE_SEC) {
            switching = true;
            const next = videos[1 - active];
            next.currentTime = 0;
            next.playbackRate = PLAYBACK_RATE;

            next.play().then(() => {
                next.classList.add('is-active');
                cur.classList.remove('is-active');
                active = 1 - active;

                // 淡化完成後暫停舊影片，釋放解碼資源
                setTimeout(() => {
                    cur.pause();
                    switching = false;
                }, CROSSFADE_SEC * 1000 + 100);
            }).catch(() => {
                // 播放失敗（極少數情況）：讓目前影片自己 loop 撐著
                cur.loop = true;
                switching = false;
            });
        }
    }, 200);
})();
