# 曼谷 5 日・ML-FC 行程

一頁式行程表，手機左右滑一天一頁，每個地點可以一鍵開 Google Maps 看位置或導航。

線上版：https://nonolin1128.github.io/milklove/

## 檔案結構

```
index.html              頁面骨架（只有結構，沒有樣式和資料）
package.json            開發指令，沒有任何 dependencies
scripts/
  dev-server.mjs        本機預覽 server（Node 內建模組，零依賴）
css/
  theme.css             ← 設計設定檔：顏色、字體、字級、間距、圓角、陰影
  base.css              reset、底色、三色柔光背景
  layout.css            一天一頁的骨架：橫向日卡、頂部大圖、黏性日期條
  components.css        行程卡、地圖按鈕、底部圓點、桌機箭頭
js/
  trip.js               ← 行程資料：改行程只動這個檔案
  config.js             圖示、分色規則、每天輪替的主題色
  util.js               跳脫、日期格式、Google Maps 搜尋字串
  render.js             把資料畫成 HTML（純函式）
  app.js                掛上畫面、滑動、圓點、鍵盤、hash
images/                 每天的頂部大圖（day1.jpg…）
```

平常只會動兩個檔案：**改行程 → `js/trip.js`**，**改外觀 → `css/theme.css`**。

## 本機預覽

```bash
npm run dev     # 然後開 http://localhost:8000
```

為什麼不能直接雙擊 `index.html`：用了 ES module，而瀏覽器把 `file://`
開啟的檔案視為 origin = null，CORS 檢查永遠不會通過，`import` 會被擋下
（頁面會顯示提示）。線上版沒這問題 —— GitHub Pages 給的是 https 網址。

server 是 `scripts/dev-server.mjs`，只用 Node 內建模組寫的，**零依賴**，
`npm install` 不用跑。連接埠被占用會自動往上找下一個。

## 改行程

編輯 `js/trip.js`，每個項目的欄位：

| 欄位 | 說明 |
|---|---|
| `time` | 時刻（`"07:00"`）或時段詞（`"午餐"`、`"傍晚"`），留空就不顯示 |
| `type` | 圖示與分色，清單見 `js/config.js`；不填會用名稱關鍵字猜 |
| `name` | 地點名稱（必填） |
| `address` | 有地址最好；沒有就用「name + city」去 Google Maps 搜 |
| `note` | 備註 |
| `nomap` | `true` = 沒有實際地點，不顯示地圖/導航按鈕 |

每天的欄位：`date`、`city`、`items`，另外 `image`（頂部大圖）、
`highlight`（主要活動日，強制粉色 + 柔光）、`badge`（大圖上的小標籤）。

## 配色

應援色三色，定義在 `css/theme.css`：

| 變數 | 色碼 | 用途 |
|---|---|---|
| `--peach` | `#FBD4D1` | 蜜桃粉 |
| `--mint` | `#CDE5C0` | 奶綠 |
| `--apricot` | `#FBDFC2` | 奶橘（暫定，等正式色碼） |

**三個原色只當底色和色塊**，`*-deep` 加深版只用於描邊和圖示 —
加深版對奶油底只有約 2.7:1 對比，拿來寫文字會讀不出來。
所有要讀的文字一律用 `--ink` / `--ink-soft`。

每天的主題色按 粉 → 綠 → 橘 輪替；`highlight: true` 的那天強制用粉。
圖示底色固定分類：**綠＝移動、橘＝吃的、粉＝其他**。

## 圖片

放進 `images/`，在 `js/trip.js` 用 `image: "images/day1.jpg"` 指定。
先壓再放：寬 1200px、WebP、每張 150KB 以下。沒給圖的那天會自動用純色漸層。

## 部署

push 到 `main` 就會自動更新（GitHub Pages）。
