# DDNS over CloudFlare
Реализация системы динамических доменных имён через API CloudFlare.  
DDNS получает ваш ip адрес через [www.cloudflare.com/cdn-cgi/trace](https://www.cloudflare.com/cdn-cgi/trace)  
Данный проект является продолжением [этого](https://github.com/Andcool-Systems/DDNS_over_CloudFlare) проекта на Java.

## config.yaml
Для работы проекту нужен конфигурационный файл `config.yaml`, находящийся в корне проекта и имеющий следующее содержание:
```yaml
zone: <zone id>
period: period
token: <token>
records:
  - hostname: example.com
    proxied: false
  - hostname: test.example.com
    proxied: true
``` 
- `zone` – id зоны CloudFlare.  
- `period` – Период в секундах, с которым будет проверяться текущий ip адрес. *(Рекомендуется 30 секунд)*  
- `token` – Bearer [токен CloudFlare](https://dash.cloudflare.com/profile/api-tokens). Должен иметь права на чтение и изменение DNS записей.  
- `records` – Массив DNS записей, которые DDNS должен отслеживать.
- - `hostname` – Имя DNS записи.
- - `proxied` – Определяет, будут ли запросы на hostname проходить через CloudFlare.  

## Начало работы
### Запуск из docker compose
`docker compose up -d`

### Стандартный запуск TypeScript
1. `npm install` – Установка зависимостей
2. `npm run build` – Компиляция TypeScript кода 
3. `npm run start` – Запуск проекта

## Принцип работы
При запуске код проверяет наличие DNS записи в CloudFlare по переданным в `config.yaml` параметрам.
Если запись не найдена, то создает новую с текущим ip адресом. После этого входит в бесконечный цикл, где каждые `period` секунд
проверяет текущий ip адрес, и если он изменился – обновляет его в CloudFlare.

---
**by AndcoolSystems, September 10, 2024.**
