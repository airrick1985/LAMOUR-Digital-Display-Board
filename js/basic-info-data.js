/* js/basic-info-data.js */
/* =========================================================================
 * ★★★ 全站「基本資料」單一資料來源（修改內容改這裡即可）★★★
 *
 * 使用此資料的頁面：
 *   1. basic-info.html — 頂部導航「基本資料」頁（分組卡片顯示）
 *   2. floor-plan.html — 4-15F 列印基本資料卡、基本資料燈箱（一維清單）
 *
 * 欄位說明：
 *   label / value：顯示名稱與內容。
 *   print（選填）：列印卡空間有限時使用的精簡版文字；未填則直接用 value。
 * ========================================================================= */
(() => {
    const groups = [
        {
            title: '基地資訊',
            en: 'SITE',
            icon: '📍',
            items: [
                { label: '基地位置', value: '新竹市東區光復路一段335巷' },
                { label: '地號',     value: '新竹市介壽段187地號' },
                { label: '基地面積', value: '約615坪　地上15F/B4' },
                { label: '規劃戶數', value: '住家 97戶' }
            ]
        },
        {
            title: '建築規劃',
            en: 'PLANNING',
            icon: '🏢',
            items: [
                { label: '停車位',   value: '汽車位 118個　機車位 117個' },
                { label: '公設比',   value: '34.8%' },
                { label: '樓高',     value: '住家 3.1米　一樓大廳挑高 8.5米' },
                { label: '電梯',     value: '15人份　速率 120 公尺/分鐘' }
            ]
        },
        {
            title: '銷售資訊',
            en: 'SALES',
            icon: '🔑',
            items: [
                { label: '車位售價', value: 'B1-325萬　B2-300萬　B3-275萬　B4-250萬',
                  print: 'B1-325　B2-300　B3-275　B4-250' },
                { label: '管理費',   value: '住家 90/坪　車位 300/個' },
                { label: '學區',     value: '關東國小、新科國中、竹科實中、康橋國際學校(規劃中)' },
                { label: '開工日',   value: '2026年5月' },
                { label: '交屋日',   value: '2034年第二季' }
            ]
        },
        {
            title: '開發團隊',
            en: 'DEVELOPMENT',
            icon: '🏗️',
            items: [
                { label: '投資興建', value: '富宇建設股份有限公司' },
                { label: '代銷公司', value: '一研九鼎廣告策劃有限公司' },
                { label: '建照號碼', value: '新竹市(114)府都建字第00072號' }
            ]
        }
    ];

    window.LAMOUR_BASIC_INFO = {
        groups,
        // 一維清單（列印卡 / 燈箱用；print 欄位優先於 value）
        flatList: groups.flatMap(g => g.items.map(it => ({
            label: it.label,
            value: it.print || it.value
        })))
    };
})();
