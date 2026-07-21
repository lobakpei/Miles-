#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FONT="${NOTO_SANS_TC:-}"
if [ -z "$FONT" ] || [ ! -f "$FONT" ]; then
  echo "Set NOTO_SANS_TC to a Traditional Chinese TTF font." >&2
  exit 2
fi

convert -size 1200x675 gradient:'#063b55-#02a99b' \
  -fill 'rgba(255,255,255,0.08)' -stroke none \
  -draw 'circle 1150,40 870,40 circle 1040,680 780,680' \
  \( "$ROOT/icon-512.png" -resize 94x94 \) -geometry +72+58 -composite \
  -font "$FONT" -fill white -pointsize 66 -weight 800 -annotate +72+240 '大額簽賬・里數計劃' \
  -fill '#d8fff7' -pointsize 31 -weight 600 -annotate +76+300 '分卡・迎新・預計里數' \
  -fill 'rgba(255,255,255,0.14)' -stroke 'rgba(255,255,255,0.55)' -strokewidth 2 \
  -draw 'roundrectangle 72,382 585,494 24,24' \
  -stroke none -fill white -pointsize 25 -weight 700 -annotate +104+430 '用 AcreMiles 計自己嗰份' \
  -fill '#d8fff7' -pointsize 20 -weight 500 -annotate +104+468 '分享連結會保留實際結果文字' \
  -fill '#f2c66d' -stroke none -draw 'roundrectangle 755,146 1088,362 26,26' \
  -fill '#f9e2a9' -draw 'roundrectangle 705,196 1038,412 26,26' \
  -fill '#ffffff' -draw 'roundrectangle 655,246 988,462 26,26' \
  -fill '#087d88' -draw 'roundrectangle 688,280 855,298 9,9 roundrectangle 688,326 914,342 8,8 roundrectangle 688,366 875,382 8,8' \
  -fill '#087d88' -pointsize 50 -weight 900 -annotate +862+432 'A+' \
  -quality 88 -sampling-factor 4:2:0 "$ROOT/img/og-earn-plan.jpg"

convert -size 1200x675 gradient:'#102d57-#087d88' \
  -fill 'rgba(255,255,255,0.07)' -stroke none \
  -draw 'circle 1160,40 875,40 circle 1080,730 780,730' \
  \( "$ROOT/icon-512.png" -resize 94x94 \) -geometry +72+58 -composite \
  -font "$FONT" -fill white -pointsize 66 -weight 800 -annotate +72+240 '環球行程・里數規劃' \
  -fill '#d8fff7' -pointsize 31 -weight 600 -annotate +76+300 '路線・艙等・飛行距離' \
  -fill 'rgba(255,255,255,0.14)' -stroke 'rgba(255,255,255,0.55)' -strokewidth 2 \
  -draw 'roundrectangle 72,382 585,494 24,24' \
  -stroke none -fill white -pointsize 25 -weight 700 -annotate +104+430 '打開連結可載入路線再改' \
  -fill '#d8fff7' -pointsize 20 -weight 500 -annotate +104+468 '出票前仍要逐段查位及確認' \
  -fill none -stroke '#f2c66d' -strokewidth 8 -draw 'bezier 690,420 760,195 990,185 1090,345' \
  -fill '#ffffff' -stroke '#f2c66d' -strokewidth 7 \
  -draw 'circle 690,420 706,420 circle 866,232 882,232 circle 1090,345 1106,345' \
  -fill '#ffffff' -stroke none -draw 'polygon 930,245 1002,273 969,283 946,322 939,286 902,275' \
  -font "$FONT" -fill '#d8fff7' -pointsize 23 -weight 700 -annotate +653+482 'HKG' -annotate +824+202 'WORLD' -annotate +1050+402 'HKG' \
  -quality 88 -sampling-factor 4:2:0 "$ROOT/img/og-redeem-itinerary.jpg"

identify "$ROOT/img/og-earn-plan.jpg" "$ROOT/img/og-redeem-itinerary.jpg"
