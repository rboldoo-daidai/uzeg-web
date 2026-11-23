# uzeg-web

uzeg.mn — Түмэн үзэг ХХК-ийн вэбсайт.

- Node 24, build-гүй, гадны сан байхгүй (`node:http`)
- Хуудсууд: `public/` хавтас
- Локалд: `node app.js` → http://localhost:3100
- Сервер (itools Plesk): `uzeg.mn` → `/httpdocs`, Passenger, startup file `app.js`
- `/api/...` хандалтыг лог-д `[API-хандалт]` гэж бүртгэнэ (хуучин хостын лицензийн API-д хандсан програм үлдсэн эсэхийг харах)
