# 「地質安心」單元:construction.html 內容 + 圖片生成 Prompt(介壽段)

> 內容依據《新竹市介壽段174等4筆地號 地基調查報告書》(永勝工程顧問,民國112年5月),與報告書一致。
> 基地面積 2,033.29 ㎡,興建地上 15 層/地下 4 層,基地內配置 4 孔鑽探(每孔 31 公尺,共 124 公尺)。

---

## 一、construction.html 程式碼(可直接貼入)

### 1. `categoryNames` 新增分類(約第 352 行)

```js
const categoryNames = {
    geology: { zh: '地質安心', en: 'GEOLOGY' },   // ← 新增
    waterproof: { zh: '防水工法', en: 'WATERPROOF' },
    structure: { zh: '結構工法', en: 'STRUCTURE' },
    smart: { zh: '智慧設備', en: 'SMART SYSTEM' }
};
```

### 2. `methods` 陣列新增六筆(建議放在陣列最前面)

```js
{
    id: 'geo-bedrock',
    title: '堅實岩盤地質',
    subtitle: 'SOLID BEDROCK FOUNDATION',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/堅實岩盤地質.webp',
    description: '經 4 孔專業地質鑽探調查(每孔深 31 公尺),基地地表下約 17.5~18.1 公尺即為砂質泥岩岩盤,標準貫入試驗 N 值均大於 50;依耐震設計規範分析,平均剪力波速 VS30 達 288~298 m/s,屬「第一類地盤(堅實地盤)」,為三類地盤中最穩固的等級。',
    isStepList: false
},
{
    id: 'geo-foundation',
    title: '建築坐落岩盤',
    subtitle: 'FOUNDATION ON BEDROCK',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/建築坐落岩盤.webp',
    description: '地下四層開挖 18.95 公尺(水池加深區 20.15 公尺),採筏式基礎設計,基礎直接坐落並深入砂質泥岩岩盤 0.85~1.45 公尺,基礎容許承載力經分析大於建築總載重(約 30.5 tf/㎡),沉陷量符合建築技術規則筏式基礎不得大於 30 公分之規定,穩固紮實。',
    isStepList: false
},
{
    id: 'geo-liquefaction',
    title: '土壤液化低潛勢',
    subtitle: 'LOW LIQUEFACTION POTENTIAL',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/土壤液化低潛勢.webp',
    description: '經政府「土壤液化潛勢查詢系統」查詢,本基地屬低潛勢區;鑽探資料經液化評估分析,在中小度地震、設計地震及最大考量地震下,均無土壤液化情形。',
    isStepList: false
},
{
    id: 'geo-sensitive',
    title: '非地質敏感區',
    subtitle: 'NON-SENSITIVE GEOLOGICAL AREA',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/非地質敏感區.webp',
    description: '經查詢中央地質調查所公告資料,基地未坐落於任何地質敏感區範圍,土地條件單純安心。',
    isStepList: false
},
{
    id: 'geo-fault',
    title: '斷層未經過基地',
    subtitle: 'NO FAULT CROSSING SITE',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/斷層未經過基地.webp',
    description: '鄰近之新城斷層(基地南側約 1.4 公里)、新竹斷層(基地北側約 2.1 公里)與湖口斷層(基地北側約 10.1 公里)均未通過基地;且建築耐震設計已依最新規範納入近斷層效應加強係數(SDS 0.84、SD1 0.50),結構安全再升級。',
    isStepList: false
},
{
    id: 'geo-clear',
    title: '無其他地質疑慮',
    subtitle: 'CLEAR GEOLOGICAL CONDITIONS',
    category: 'geology',
    categoryLabel: '地質安心',
    image: 'assets/images/geology/無其他地質疑慮.webp',
    description: '基地地形平坦,無侵蝕、潛移、崩塌、滑動情形;位於店子湖層非產煤地層,無礦坑、礦渣堆與隧道;地下水位在地表下約 3.5~4.0 公尺,永久性設計並採更保守之 GL-1.0 公尺水位條件分析,層層把關。',
    isStepList: false
},
```

> 圖片路徑預設為 `assets/images/geology/`,生成後請轉為 webp 並依上列檔名放置。
> 免責聲明列已有「3D 示意僅供參考」字樣,適用本單元。

---

## 二、六張圖片生成 Prompt(3D 示意風格,英文版)

> Prompt 主體為英文(模型理解度較佳),圖中要渲染的文字保留繁體中文字串。
> **以下六段皆已內含共同風格與建物外觀描述,整段直接複製貼上即可使用,不需再另外拼接。**

### ★ 使用前必做:上傳建物外觀參考圖

圖 1、2、3、5、6 都有建築物,**生圖時請一併上傳本案建物外觀圖當參考圖**,模型才會畫出本案外觀而非隨機大樓。

| 步驟 | 做法 |
| --- | --- |
| 1. 準備參考圖 | 用 `assets/images/3D-01.webp`(日景外觀,建議先轉存 JPG/PNG,部分生圖工具不吃 webp) |
| 2. 上傳 | Gemini / Nano Banana、ChatGPT 圖像、Firefly 等:直接把圖拖進對話,再貼下方 prompt |
| 3. Midjourney | 於 prompt 末端加 `--cref <圖片網址> --cw 100`(鎖人/物外觀)或 `--sref <圖片網址>` |
| 4. 若工具不支援參考圖 | prompt 內已附完整英文外觀描述,可單靠文字生成,惟相似度會較低 |

> 若 **介壽段另有專屬外觀圖**,請改上傳該張,並把 prompt 內 `BUILDING (must match the attached reference image)` 段落的樓層數與材質描述一併調整。

<details>
<summary>共同風格單獨版(僅供調整風格時參考,一般不需使用)</summary>

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
```

</details>

### 圖 1|堅實岩盤地質

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a 3D cross-section cutaway block of ground strata, clearly divided
into four layers from top to bottom — a very thin brown fill layer at the
surface, a red-brown silty clay layer, a thicker yellow-brown sandy clay layer
with a few scattered pebbles, and at the bottom a thick dark-grey sandy
mudstone bedrock layer (occupying the lower third of the block height, with a
solid stone-like texture).
A 15-story residential tower stands firmly on top of the block, at the center.
BUILDING — must match the attached reference image exactly:
a slender 15-story modern residential tower on a rectangular slab plan;
full-height vertical fluted stone fins in warm greige; charcoal and bronze metal
frames; dark tinted floor-to-ceiling glazing with recessed balconies; large
light-grey stone cladding panels on the flank wall; the vertical fins extend
above the roofline into a comb-like crown with bronze-gold louvers; a dark stone
two-story entrance portal with bronze trim at the base.
Keep the facade proportions, materials and colors of the reference exactly —
do not redesign the building, do not add extra towers.
A clean callout line next to the bedrock layer labeled with the text
「地下約18公尺即為岩盤」.
Large headline at the top of the image: 「第一類地盤・堅實地質」.
```

### 圖 2|建築坐落岩盤

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a 3D vertical cross-section of a building — a 15-story residential
tower above ground with a 4-level basement below ground. At the very bottom of
the basement sits a thick raft (mat) foundation slab, clearly embedded into the
dark-grey bedrock layer at the base.
BUILDING — the above-ground tower must match the attached reference image exactly:
a slender 15-story modern residential tower on a rectangular slab plan;
full-height vertical fluted stone fins in warm greige; charcoal and bronze metal
frames; dark tinted floor-to-ceiling glazing with recessed balconies; large
light-grey stone cladding panels on the flank wall; the vertical fins extend
above the roofline into a comb-like crown with bronze-gold louvers; a dark stone
two-story entrance portal with bronze trim at the base.
Keep the facade proportions, materials and colors of the reference exactly —
do not redesign the building, do not add extra towers.
The basement and foundation are highlighted with bright green outlines; the
bedrock is rendered with a dark-grey stone texture.
A callout line at the foundation-bedrock interface labeled with the text
「開挖18.95公尺・基礎坐落岩盤」.
Large headline at the top of the image: 「筏式基礎・穩固紮實」.
```

### 圖 3|土壤液化低潛勢

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a 3D map platform with a residential tower standing on it.
The ground around the building is stable, intact and dry green land — no
cracks, no water stains.
BUILDING — must match the attached reference image exactly:
a slender 15-story modern residential tower on a rectangular slab plan;
full-height vertical fluted stone fins in warm greige; charcoal and bronze metal
frames; dark tinted floor-to-ceiling glazing with recessed balconies; large
light-grey stone cladding panels on the flank wall; the vertical fins extend
above the roofline into a comb-like crown with bronze-gold louvers; a dark stone
two-story entrance portal with bronze trim at the base.
Keep the facade proportions, materials and colors of the reference exactly —
do not redesign the building, do not add extra towers.
A large green shield icon with a checkmark floats in front of the building.
Large headline at the top of the image: 「土壤液化低潛勢區」.
Smaller caption below: 「三種地震規模下皆無液化情形」.
```

### 圖 4|非地質敏感區(此張無建築物,不需上傳參考圖)

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a 3D administrative district map floating in the center of the
frame, rendered in soft green tones. The project site is marked with a prominent
green location pin topped with a checkmark. The map is clean and intact, with no
warning-colored zones or hazard markers.
Beside the map, a 3D document icon representing an official query certificate.
Large headline at the top of the image: 「非地質敏感區」.
Smaller caption below: 「經中央地質調查所公告資料查詢確認」.
```

### 圖 5|斷層未經過基地

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a 3D regional terrain map with the project site and a residential
tower at the center, marked with a green location pin. A soft green safety zone
circle surrounds the site.
BUILDING — must match the attached reference image exactly:
a slender 15-story modern residential tower on a rectangular slab plan;
full-height vertical fluted stone fins in warm greige; charcoal and bronze metal
frames; dark tinted floor-to-ceiling glazing with recessed balconies; large
light-grey stone cladding panels on the flank wall; the vertical fins extend
above the roofline into a comb-like crown with bronze-gold louvers; a dark stone
two-story entrance portal with bronze trim at the base.
Keep the facade proportions, materials and colors of the reference exactly —
do not redesign the building, do not add extra towers.
At the far edges of the map, two semi-transparent orange dashed lines indicate
fault traces — one toward the lower (south) edge with a small label tag
「新城斷層 約1.4公里」, one toward the upper (north) edge with a small label tag
「新竹斷層 約2.1公里」. Both dashed lines stay clearly away from the central
site and never cross the green zone.
Large headline at the top of the image: 「斷層未經過基地」.
```

### 圖 6|無其他地質疑慮

```
3D isometric architectural illustration, clean soft studio lighting, light beige
background, primary color palette of deep green (#2D5016) with warm earth tones,
modern 3D render style with smooth rounded edges and refined materials,
horizontal 16:9 composition, minimal and uncluttered scene.
All text inside the image must be rendered in Traditional Chinese (繁體中文),
bold clean sans-serif font, large and highly legible, minimal wording,
no typos, no English words, no Simplified Chinese characters.
Main subject: a flat, open 3D green plateau with a residential tower on top.
The terrain is level with no slopes; the ground cross-section is clean
and solid with no cavities or tunnels.
BUILDING — must match the attached reference image exactly:
a slender 15-story modern residential tower on a rectangular slab plan;
full-height vertical fluted stone fins in warm greige; charcoal and bronze metal
frames; dark tinted floor-to-ceiling glazing with recessed balconies; large
light-grey stone cladding panels on the flank wall; the vertical fins extend
above the roofline into a comb-like crown with bronze-gold louvers; a dark stone
two-story entrance portal with bronze trim at the base.
Keep the facade proportions, materials and colors of the reference exactly —
do not redesign the building, do not add extra towers.
On the right side of the frame floats a 3D checklist card with three checked
items in three lines: 「✓ 無崩塌滑動」「✓ 無礦坑隧道」「✓ 水位保守設計」.
Large headline at the top of the image: 「無其他地質疑慮」.
```

---

## 三、生成小提醒

- 目前 AI 生圖對繁體中文字仍可能出錯,建議:**先生成無文字或少字版本,再以修圖軟體疊上文字**,可確保字體正確又與網站風格一致。
- 六張圖請使用同一組 prompt 共同風格連續生成,維持色調與視角一致。
- 生成後轉為 webp(建議寬 1600px 以上,供 lightbox 放大檢視)。

**建物外觀相似度不夠時的補救順序:**

1. **同一對話連續生成** — 先產出圖 1 並確認外觀正確,再在同一對話接著下圖 2~6 的 prompt,模型會延續已建立的建物特徵。
2. **加強指令** — 在 prompt 最後補一句:`The building must be a faithful 3D stylized version of the attached reference photo — same fin rhythm, same greige-and-bronze palette, same crown silhouette.`
3. **改用局部重繪** — 直接把 3D-01 去背後的大樓貼進生成好的底圖,再用 inpainting 融合光影,是最穩的做法。
4. **負面提示**(支援的工具才填):`generic glass skyscraper, blue curtain wall, colorful facade, different building, multiple towers`

---

## 四、報告書關鍵數據對照(僅供內部核對,不上網站)

| 項目 | 介壽段(本案) | 長春段(既有單元) |
| --- | --- | --- |
| 報告書 | 介壽段174等4筆地號,112 年 5 月 | 長春段874等11筆地號,112 年 3 月 |
| 基地面積 | 2,033.29 ㎡ | — |
| 規模 | 地上 15 層/地下 4 層 | 地上 15 層/地下 3 層 |
| 鑽探 | 4 孔 × 31m(共 124m) | — |
| 區域地層 | 店子湖層(Tz) | — |
| 岩盤深度 | GL-17.5 ~ -18.1m(砂質泥岩 MSs,N>50) | 地下約 9m |
| 開挖深度 | GL-18.95m(水池加深區 20.15m) | GL-12.7m |
| 基礎入岩 | 0.85 ~ 1.45m | 3.5m 以上 |
| 總載重 | 約 30.5 tf/㎡,容許承載力大於總載重 | — |
| 沉陷量 | 30 公分以內(符合筏基規範上限) | 符合法規 |
| 地下水位 | GL-3.5 ~ -4.0m;臨時 GL-3.0m、永久 GL-1.0m 分析 | GL-6.4m |
| 地盤分類 | 第一類地盤(VS30 = 288 ~ 298 m/s) | 第一類地盤 |
| 地震係數 | 中小度 0.08、設計 0.34、最大考量 0.44 | — |
| 近斷層效應 | 是(SDS 0.84、SD1 0.50、SMS 1.10、SM1 0.66) | 是 |
| 新城斷層 | 第一類活動斷層,基地南側約 1.4km | 約 2.1km |
| 新竹斷層 | 第二類活動斷層,基地北側約 2.1km | 約 1.5km |
| 湖口斷層 | 第二類活動斷層,基地北側約 10.1km | — |
| 土壤液化 | 低潛勢區,三種地震規模下皆無液化 | 低潛勢區 |
| 地質敏感區 | 未坐落(112 年 5 月查詢) | 未坐落 |
| 礦坑/隧道 | 無(非產煤地層) | 無 |

> **註(斷層距離差異):** 報告書第七章結論第 6 點寫「新城斷層距南側約 2.1km、新竹斷層距北側約 1.5km」,
> 與內文表 3-1、4-2 節、4-4 節及表 5-6(近斷層調整因子採用 1.4km)所載之「新城斷層南側約 1.4km、
> 新竹斷層北側約 2.1km」不一致,結論該段數字疑為沿用他案。本文件採內文及耐震計算所用之
> **新城 1.4km / 新竹 2.1km**;正式文宣露出前,建議再向永勝工程顧問確認。
